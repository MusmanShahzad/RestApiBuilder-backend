const fs = require('fs');
const {generateRoute} = require('./routesFile');
const routeImportSkeleton=`const {{route}}Route = require('./routes/{{route}}');`
let importsData = [
    `const bodyParser = require('body-parser');`,
    `const express = require('express');`,
    `const connection= require('./helpers/connection');`,
    `const jwt = require('jsonwebtoken');`
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
    `app.use('/upload', express.static('upload'));`,
    `app.use((req,res,next)=>{
        if (req.headers.authtoken) {
            try {
                let output = jwt.verify(req.headers.authtoken, process.env.PRIVATE_KEY || 'secret');
                req.payload = output.payload;
                console.log('authenticated')
                req.isAuth = true;
            } catch (err) {
                console.log('not authenticated')
                req.isAuth = false;
            }
    
        } else {
            req.isAuth = false;
        }
        next();
    })`
];
let routeSkeleton=`app.use('/{{route}}',{{route}}Route)`;
let routes=[]
let serverStart='app.listen(PORT, () => {'
    +'\nconsole.log(`🚀 Server Running on http://localhost:${PORT}/`);'
+'\n});';
const generateRoutes=async (data,folder)=>{
   for( let element of data ) {
       importsData.push( routeImportSkeleton.replace(/{{route}}/g,element.path));
       routes.push(routeSkeleton.replace(/{{route}}/g,element.path));
      let out = await fs.writeFileSync(`${folder}/routes/${element.path}.js`, generateRoute(element));
    }
};

const generateMainFile=async (data,folder)=>{
 await generateRoutes(data.routes,folder);  
 let final =''; 
 final+=`
 //Imports \n
 \n${importsData.join('\n')}
 \n//Global Variables \n
 \n${globalVariables.join('\n')}
 \n//Middleware \n
 \n${middleWares.join('\n')}
 \n//Routes \n
 \n${routes.join('\n')}
 \n//Server\n
 \n${serverStart}`;
 let out = await fs.writeFileSync(`${folder}/app.js`, final);
 return final
}
module.exports={generateMainFile}