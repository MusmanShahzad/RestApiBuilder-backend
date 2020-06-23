const env = require('dotenv').config();
const jwt = require("jsonwebtoken");
const authenticationMiddleware=(req, res, next) => {
    if(req.headers.authtoken == undefined){
        res.status(401).send('missing authorization header');
        return;
    }else{
        let result = jwt.verify(req.headers.authtoken, process.env.JWT_SECRET);
        req.isAuth=true; 
        req.userId=result.userId;
        next();
        }
}
module.exports = {authenticationMiddleware};