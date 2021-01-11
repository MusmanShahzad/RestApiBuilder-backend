const validatorData = require('./validator.data');
let middleWares = [];
const variableSkelton = 'const {{variable}}=req.{{parse}}.{{variable}}.toString();'
let imports = [
    "const jwt = require('jsonwebtoken');",
    "const express = require('express');",
    "const {body,validationResult,query,param,header} = require('express-validator');",
    "const connection = require('./../helpers/connection');",
    "const authMiddleware = require('./../middleware/authMiddleware');",
    "const upload = require('./../helpers/upload');",
    "const env = require('dotenv').config();"

];
let globalVariables = [
    "var router = express.Router();"
]
let routeSkeleton = `router.{{method}}('/{{route}}',{{middleware}} async (req, res) => {
        {{validator}}\n
        {{variables}}\n
        \n{{response}}\n
    });`;
let tokenResponse=`
let output = await connection.executeQuery(\`{{query}}\`);
if(output.error){
    res.json(output);
    return;
}
else{
    if(output.data.length>0){
        res.json({...output,token:jwt.sign(
            { data:output.data },
            process.env.PRIVATE_KEY,
            {
              expiresIn: "15d",
            }
          )});
          return;
    }
    else{
        res.json(output);
        return; 
    }
}
`;
let response=`return res.json(await connection.executeQuery(\`{{query}}\`));`

const generateRoutes = (route, isChild) => {
    let out = [];
    for (let method in route.methods) {
        if(!route.methods[method].variables){
            route.methods[method].variables=[];
        }
        let routeMiddleware = [];
        let temp = fileUpload(route.methods[method].variables);
        if (temp !== '')
            routeMiddleware.push(temp);
            let validate=variablesValidation(route.methods[method].variables);
            if(validate!="")routeMiddleware.push(validate);
        if (route.methods[method].auth===true) {
            routeMiddleware.push('authMiddleware')
        }
       let tempRoute= routeSkeleton.replace(/{{method}}/g, method)
            .replace('{{route}}', isChild ? route.path : '')
            
            .replace('{{variables}}', declareVariables(route.methods[method].variables))
            .replace('{{response}}', generateResponse(route.methods[method].getToken,route.methods[method].query));
            if(validate!=""){
                tempRoute=tempRoute.replace('{{validator}}',
                `const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }`
                );
            }
            else{
                    tempRoute=tempRoute.replace('{{validator}}','');
            }
            if(routeMiddleware.length>0){
                tempRoute=tempRoute.replace('{{middleware}}', routeMiddleware.join(',') +",")
            }
            else{
                tempRoute=tempRoute.replace('{{middleware}}', '' )
            }
        out.push(tempRoute);

    }
    if (route.children)
        route.children.forEach(child => {
            out.push(generateRoutes(child, true));
        })
    return `${out.join('\n')}\n`;
}
const fileUpload = (variables) => {
    let fileUploads = '';
    variables.forEach(variable => {
        if (variable.type === 'file') {
            if (fileUploads === '') {
                fileUploads = 'upload.fields(['
            }
            fileUploads += `{
                name: '${variable.name}',
                maxCount: ${variable.validator.max==0?1:variable.validator.max}
            },`
        }
    })
    return fileUploads == '' ? '' : `${fileUploads}])`;


}
const variablesValidation = (variables) => {
    let validationArray = [];
    if(variables.length==0){
        return "";
    }
    variables.forEach((variable, index) => {
        
        if (variable.type === 'file') {
            return;
        }
        let validationString = '';
        validationString +=
            validatorData.parse.replace(/{{parse}}/g, variable.parse).replace(/{{variable}}/g, variable.name);
          if(variable.validator){  
        if (variable.validator.required) {
            validationString += validatorData['required'];
        }
        validationString += validatorData[variable.type].default;

        if (variable.validator.regex&&variable.validator.regex!='') {
            validationString += validatorData.regex.replace(/{{regex}}/g, variable.validator.regex)
        }
        if (variable.validator.min) {
            validationString += validatorData[variable.type].min.replace(/{{min}}/g, variable.validator.min);
        }
        if (variable.validator.max) {
            validationString += validatorData[variable.type].max.replace(/{{max}}/g, variable.validator.max);
        }
    }
    else{
        validationString += validatorData[variable.type].default;
    }
        validationArray.push(validationString);
    });
    return `[\n${validationArray.join(',\n')}\n]`;
}

const declareVariables = (variables) => {
    let out = [];
    variables.forEach(variable => {
        let variablesString = '';
        if (variable.type !== 'file') {
            variablesString += variableSkelton.replace(/{{variable}}/g, variable.name)
                .replace('{{parse}}', variable.parse === 'param' ? 'params' : variable.parse);
        } else {
            variablesString += variableSkelton.replace(/{{variable}}/g, variable.name)
                .replace('{{parse}}', 'files');
        }
        out.push(variablesString)
    })
    return `${out.join("\n")}\n`;
}
const generateRoute = (route) => {
    return `//Imports\n
    ${imports.join('\n')}\n
    ${globalVariables.join('\n')}\n
    ${middleWares.join('\n')}\n
    ${generateRoutes(route,false)}\n
    module.exports=router;
    `
}
const generateResponse=(token,query)=>{
    if(query===''){
        return 'res.json({error:true,message:"No query found!"});\nreturn;'
    }
    if(token){
       return tokenResponse.replace(/{{query}}/g,query);
    }
    else{
        return response.replace(/{{query}}/g, query);
    }
}
module.exports = {
    variablesValidation,
    declareVariables,
    generateRoutes,
    generateRoute
};