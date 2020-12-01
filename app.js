//libraries
const fs = require('fs');
const fsExtra = require('fs-extra');
const {
    v4: uuidv4
} = require('uuid');
const express = require('express');
const jwt = require("jsonwebtoken");
const env = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const zip = require('express-easy-zip');
const mongoose = require('mongoose');
const {
    generateMainFile
} = require('./function/RestapiGenrationFunction/mainFile');
//functions
const {
    createQuery
} = require('./function/sqlFileGenrationFunction/createQuriesFunctions');
const {variablesValidation,declareVariables,generateRoute} = require('./function/RestapiGenrationFunction/routesFile');
//Middle Wares
const {
    authenticationMiddleware
} = require('./middleware/auth');
//Routes
const comboBoxRoute = require('./routes/comboBox');
const userRoute = require('./routes/user');
const projectRoute = require('./routes/project');
const route = require('./routes/routesBuilder');
//Middle ware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(zip());
app.use(cors({
    origin: '*'
}));
app.use('/upload', express.static('upload'))
//Global Variables
const defaultDir = 'userRestapi';
//Server
let testData={
    "projectId": "Project linked",
    "port": 8080,
    "secretKey": "Token Genrating key",
    "routes": [
        {
        "path": "name",
        "auth": true,
        "methods": {
            "get": {
                "auth": true,
                "query": "SQL Query",
                "variables": [{
                    "name": "Name",
                    "type": "string",
                    "parse": "body",
                    validator:{
                        min:4,
                        max:5,
                        regex:''
                    }
                }]
            },
            "post": {
                "auth": true,
                "query": "SQL Query",
                "variables": [{
                    "name": "Name",
                    "type": "int",
                    "parse": "body",
                    validator:{
                        min:4,
                        max:5,
                        regex:''
                    }
                }]
            },
            
        },
        "children":[{
            "path": "name",
            "auth": true,
            "methods": {
                "get": {
                    "auth": true,
                    "query": "SQL Query",
                    "variables": [{
                        "name": "Name",
                        "type": "string",
                        "parse": "body",
                        validator:{
                            min:4,
                            max:5,
                            regex:''
                        }
                    }]
                },
                "post": {
                    "auth": true,
                    "query": "SQL Query",
                    "variables": [{
                        "name": "Name",
                        "type": "int",
                        "parse": "body",
                        validator:{
                            min:4,
                            max:5,
                            regex:''
                        }
                    }]
                }
            }
        }]
        
    }
]
}
//console.log(generateRoute(testData.routes[0]));
const startServer = async () => {
    try {
        await mongoose.connect(
            `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false`, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useFindAndModify: false
            }
        );
    } catch (err) {
        console.log(err)
    }
    app.get('/', (req, res) => {
        res.send('hello');
    })
    app.post('/sql', async (req, res) => {
        
        let dir = uuidv4();
        let data = req.body;
        if (!fs.existsSync(`./${defaultDir}/${dir}`)) {
            fs.mkdirSync(`./${defaultDir}/${dir}`);
        }
        let path = `${defaultDir}/${dir}/${data.name}.sql`;
        let out = await fs.writeFileSync(path, createQuery(data));
        res.json({
            error: false,
            data: {
                path
            }
        });
        return;

    });
    app.post('/restApiBuilder', async (req, res) => {
        let dir = uuidv4();
        let data = req.body;
        if (!fs.existsSync(`./${defaultDir}/${dir}`)) {
            fs.mkdirSync(`./${defaultDir}/${dir}`);
        }
        let path = `${defaultDir}/${dir}`;
       // let out = await fs.writeFileSync(`${path}/database.sql`, createQuery(data));
        fsExtra.copySync('./../restApiSekelton', path);

        res.json({
            error: false,
            data: {
                path
            }
        });
        return;
    });
    app.get('/restApiBuilder', async (req, res) => {
        let dir = uuidv4();
        let data = req.body;
        console.log(data);
        if (!fs.existsSync(`./${defaultDir}/test/${dir}`)) {
            fs.mkdirSync(`./${defaultDir}/test/${dir}`);
        }
        let path = `${defaultDir}/test/${dir}`;
        //let out = await fs.writeFileSync(`${path}/database.sql`, createQuery(data));
        fsExtra.copySync('./../restApiSekelton', path);
       await generateMainFile(data,path);
        res.json({
            error: false,
            data: {
                path:''
            }
        });
        return;
    });
    app.post('/test', async (req, res) => {
        res.send(req.body);
    });
    app.get(`/${defaultDir}/:folder/:file`, (req, res) => {
        res.sendFile(`${__dirname}/${defaultDir}/${req.params.folder}/${req.params.file}`)
    });
    app.get(`/${defaultDir}/:folder`, (req, res) => {
        res.zip({
            files: [{
                    content: `1. To Run application change name of example.env file to .env file
                2. Change env defaut values to your suitable values
                3. Type command npm i to install npm package
                4. type npm run test to run teh application
                5. send requests on url localhost:PORT/api/{tableName}`,
                    name: 'Documnet.txt',
                    mode: 0755,
                    comment: `This is a documentation for your rest api to run`,
                    date: new Date(),
                    type: 'file'
                },
                {
                    path: `${__dirname}/${defaultDir}/${req.params.folder}`,
                    name: 'Rest-Api-Builder'
                },
            ],
            filename: 'Rest-Api-Builder'
        });
    });
    app.use('/combobox', comboBoxRoute);
    app.use('/user', userRoute);
    app.use('/project', projectRoute);
    app.use('/router', route);
    app.listen(4000, () => {
        console.log("🚀 Server Running on http://localhost:4000/");
    });
}
startServer();