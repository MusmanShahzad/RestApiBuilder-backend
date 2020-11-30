const fs = require('fs');
const {generateRoute} = require('./routesFile');
const routeImportSkeleton=`const {route}Route = require('./routes/{route}');`
let importsData = [
    `const bodyParser = require('body-parser');`,
    `const express = require('express');`,
    `const connection= require('./helpers/connection');`
];
let globalVariables=[
    `const app = express();`,
    `const PORT = process.env.PORT || 3000;`,
    `connection.connect();`
]
let middleWares=[
    `app.use(bodyParser.urlencoded({
        extended: true
    }));`,
    `app.use(bodyParser.json());`,
    `app.use(bodyParser.raw());`,
    `app.use('/upload', express.static('upload'))`
];
let routeSkeleton=`app.use('/{route}',{route}Route)`;
let routes=[]
let serverStart='app.listen(PORT, () => {'
    +'console.log(`🚀 Server Running on http://localhost:8080/${PORT}`);'
+'});';
const generateRoutes=async (data,folder)=>{
    await data.forEach(async element => {
       importsData.push( routeImportSkeleton.replace(/{{route}}/g,element.path));
       routes.push(routeSkeleton.replace(/{{route}}/g,element.path));
       let out = await fs.writeFileSync(`${folder}/routes`, createQuery(data));
    });
};

const generateMainFile=(data,folder)=>{
 generateRoutes(data.routes,folder);
 let final=importsData.join('\n');   
 final+=`\n${globalVariables.join('\n')}
 \n${middleWares.join('\n')}
 \n${importsData.join('\n')}
 \n${routes.join('\n')}
 \n${serverStart}`;
 return final
}
module.exports={generateMainFile}