const validatorData = require('./validator.data');
let middleWares = [];
const variableSkelton = 'const {{variable}}=req.{{parse}}.{{variable}}.toString();'
let imports = [
    "const express = require('express');",
    "const {body,validationResult,query,param,header} = require('express-validator');",
    "const connection = require('./../helpers/connection');",
    "const authMiddleware = require('./../middleware/authMiddleware');",
    "const upload = require('./../helpers/upload');"

];

//let uploadImport="const upload = require('./../helpers/upload');";

let globalVariables = [
    "var router = express.Router();"
]
let routeSkeleton = `router.{{method}}('/{{route}}',{{middleware}} async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        {{variables}}\n
        return res.json(await connection.executeQuery(\`{{query}}\`))\n
    });`

const generateRoutes = (route, isChild) => {
    let out = [];
    console.log(route)
    for (let method in route.methods) {
        let routeMiddleware = [];
        let temp = fileUpload(route.methods[method].variables);
        if (temp !== '')
            routeMiddleware.push(temp);
        routeMiddleware.push(variablesValidation(route.methods[method].variables));
        if (route.methods[method].auth || route.auth) {
            routeMiddleware.push('authMiddleware')
        }
        out.push(routeSkeleton.replace(/{{method}}/g, method)
            .replace('{{route}}', isChild ? route.path : '')
            .replace('{{middleware}}', routeMiddleware.join(',') + ",")
            .replace('{{variables}}', declareVariables(route.methods[method].variables))
            .replace('{{query}}', route.methods[method].query));

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
            // {
            //     name: 'avatar',
            //     maxCount: 1
            // }
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
    variables.forEach((variable, index) => {
        if (variable.type === 'file') {
            return;
        }
        let validationString = '';
        validationString +=
            validatorData.parse.replace(/{{parse}}/g, variable.parse).replace(/{{variable}}/g, variable.name)
        if (variable.validator.required) {
            validationString += validatorData['required'];
        }
        validationString += validatorData[variable.type].default;

        if (variable.validator.regex != '') {
            validationString += validatorData.parse.replace(/{{regex}}/g, variable.validator.regex)
        }
        if (variable.validator.min) {
            validationString += validatorData[variable.type].min.replace(/{{min}}/g, variable.validator.min);
        }
        if (variable.validator.max) {
            validationString += validatorData[variable.type].max.replace(/{{max}}/g, variable.validator.max);
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
module.exports = {
    variablesValidation,
    declareVariables,
    generateRoutes,
    generateRoute
};