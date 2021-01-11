
 //Imports 

 
const bodyParser = require('body-parser');
const express = require('express');
const connection= require('./helpers/connection');
const jwt = require('jsonwebtoken');
const userRoute = require('./routes/user');
const user/loginRoute = require('./routes/user/login');
const userRoute = require('./routes/user');
const user/loginRoute = require('./routes/user/login');
const userRoute = require('./routes/user');
const loginRoute = require('./routes/login');
 
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

 
app.use('/user',userRoute)
app.use('/user/login',user/loginRoute)
app.use('/user',userRoute)
app.use('/user/login',user/loginRoute)
app.use('/user',userRoute)
app.use('/login',loginRoute)
 
//Server

 
app.listen(PORT, () => {
console.log(`🚀 Server Running on http://localhost:${PORT}/`);
});