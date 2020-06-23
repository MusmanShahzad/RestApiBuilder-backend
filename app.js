const fs = require('fs')
const fsExtra=require('fs-extra') // in javascript
const {createQuery}  = require('./function/sqlFileGenrationFunction/createQuriesFunctions');
const express=require('express');
const comboBoxRoute=require('./routes/commboBox');
const userRoute=require('./routes/user');
const {authenticationMiddleware} = require('./middleware/auth');
const cors = require('cors');
const bodyParser = require('body-parser');
const {insertQuery} = require('./function/restapiGenrationFunctions/createQuriesFunction');
const app = express();
const zip = require('express-easy-zip');
const projectRoute =require('./routes/project');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(zip());
app.use(cors({origin:'*'}));
app.use('/upload', express.static('upload'))

// insertQuery({
//     column:"sdsdsd"
// })
const defaultDir='userRestapi';
const { v4: uuidv4 } = require('uuid');
const env = require('dotenv').config();
const jwt = require("jsonwebtoken");
const startServer=async ()=>{
    try{
    await mongoose.connect(
        `mongodb://localhost:27017/RestapiBuilder?retryWrites=true&w=majority`, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useFindAndModify: false
        });
        console.log('connected')
    } catch (err) {
        console.log(err)
    }
    app.get('/',(req,res)=>{
        res.send('hello');
    })
    app.post('/sql', async (req, res) =>{
        let dir =uuidv4();
        let data=req.body; 
        if (!fs.existsSync(`./${defaultDir}/${dir}`)){
            fs.mkdirSync(`./${defaultDir}/${dir}`);
        }
        let path=`${defaultDir}/${dir}/${data.name}.sql`;
        let out = await fs.writeFileSync(path, createQuery(data));
        res.json({error:false,
            data:{
                path}
           });
           return;
        
    });
    app.post('/restApiBuilder',async (req,res)=>{
        let dir =uuidv4();
        let data=req.body; 
        if (!fs.existsSync(`./${defaultDir}/${dir}`)){
            fs.mkdirSync(`./${defaultDir}/${dir}`);
        }
        let path=`${defaultDir}/${dir}`;
        let out = await fs.writeFileSync(`${path}/database.sql`, createQuery(data));
        fsExtra.copySync('./../restApiSekelton', path);
        
        res.json({error:false,
            data:{
                path}
           });
           return;
    })
    app.post('/test', async (req, res)=>{
        res.send(req.body);
    })
    app.get(`/${defaultDir}/:folder/:file`,(req,res)=>{
        res.sendFile(`${__dirname}/${defaultDir}/${req.params.folder}/${req.params.file}`)
    });
    app.get(`/${defaultDir}/:folder`,(req,res)=>{
        res.zip({
            files: [
                { content: `1. To Run application change name of example.env file to .env file
                2. Change env defaut values to your suitable values
                3. Type command npm i to install npm package
                4. type npm run test to run teh application
                5. send requests on url localhost:PORT/api/{tableName}`,
                     name: 'Documnet.txt',
                     mode: 0755,
                  comment: `This is a documentation for your rest api to run`,
                     date: new Date(),
                     type: 'file' },
                { path:  `${__dirname}/${defaultDir}/${req.params.folder}`, name: 'Rest-Api-Builder' }, //can be a file
                   //or a folder
            ],
            filename: 'Rest-Api-Builder'
        });
    });
    app.use('/combobox',comboBoxRoute);
    app.use('/user',userRoute);
    app.use('/project',projectRoute);
    app.listen(8080,()=>{
        console.log("🚀 Server Running on http://localhost:8080/")
    });
}
startServer();