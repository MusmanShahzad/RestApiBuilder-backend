
 //Imports 

 
const bodyParser = require('body-parser');
const express = require('express');
const connection= require('./helpers/connection');
const jwt = require('jsonwebtoken');
const firstRoute = require('./routes/first');
const secondRoute = require('./routes/second');
const firstRoute = require('./routes/first');
const secondRoute = require('./routes/second');
 
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
    })
 
//Routes 

 
app.use('/first',firstRoute)
app.use('/second',secondRoute)
app.use('/first',firstRoute)
app.use('/second',secondRoute)
 
//Server

 
app.listen(PORT, () => {
console.log(`🚀 Server Running on http://localhost:${PORT}/`);
});