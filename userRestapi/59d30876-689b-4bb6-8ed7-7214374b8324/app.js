
 //Imports 

 
const bodyParser = require('body-parser');
const express = require('express');
const connection= require('./helpers/connection');
const jwt = require('jsonwebtoken');
const containersRoute = require('./routes/containers');
const statusRoute = require('./routes/status');
const usersRoute = require('./routes/users');
 
//Global Variables 

 
const app = express();
const PORT = process.env.PORT || 3000;
connection.connect();
 
//Middleware 

 
app.use(bodyParser.urlencoded({
        extended: true
    }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use('/upload', express.static('upload'));
app.use((req,res,next)=>{
        if (req.headers.authtoken) {
            try {
                let output = jwt.verify(req.headers.authtoken, process.env.PRIVATE_KEY || 'secret');
                req.payload = output.payload;
                req.isAuth = true;
            } catch (err) {
                req.isAuth = false;
            }
    
        } else {
            req.isAuth = false;
        }
        next();
    })
 
//Routes 

 
app.use('/containers',containersRoute)
app.use('/status',statusRoute)
app.use('/users',usersRoute)
 
//Server

 
app.listen(PORT, () => {
console.log(`🚀 Server Running on http://localhost:${PORT}/`);
});