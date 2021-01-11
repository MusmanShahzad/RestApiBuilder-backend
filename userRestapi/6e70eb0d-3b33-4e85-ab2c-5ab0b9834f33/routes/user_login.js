//Imports

    const jwt = require('jsonwebtoken');
const express = require('express');
const {body,validationResult,query,param,header} = require('express-validator');
const connection = require('./../helpers/connection');
const authMiddleware = require('./../middleware/authMiddleware');
const upload = require('./../helpers/upload');
const env = require('dotenv').config();

    var router = express.Router();

    

    router.get('/',[
body('Name').isString().withMessage('Should be string').isLength({min:4}).withMessage('Value should be greater than 4').isLength({max:5}).withMessage('Value should be less than 5')
],authMiddleware, async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const Name=req.body.Name.toString();


        
return res.json(await connection.executeQuery(`SQL Query`));

    });
router.post('/',[
body('email').isEmail().withMessage('email is not correct'),
body('password').isString().withMessage('Should be string')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const email=req.body.email.toString();
const password=req.body.password.toString();


        

let output = await connection.executeQuery(`select * from user where email='${email}' and password='${password}'`);
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


    });
router.put('/',[
body('Name').isNumeric().withMessage('should be numeric').isFloat({min:4}).withMessage('value should be greater than 4').isFloat({max:5}).withMessage('value should be less than 5')
],authMiddleware, async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const Name=req.body.Name.toString();


        
return res.json(await connection.executeQuery(`SQL Query`));

    });
router.patch('/',[
body('Name').isNumeric().withMessage('should be numeric').isFloat({min:4}).withMessage('value should be greater than 4').isFloat({max:5}).withMessage('value should be less than 5')
],authMiddleware, async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const Name=req.body.Name.toString();


        
return res.json(await connection.executeQuery(`SQL Query`));

    });
router.delete('/',[
body('Name').isNumeric().withMessage('should be numeric').isFloat({min:4}).withMessage('value should be greater than 4').isFloat({max:5}).withMessage('value should be less than 5')
],authMiddleware, async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const Name=req.body.Name.toString();


        
return res.json(await connection.executeQuery(`SQL Query`));

    });


    module.exports=router;
    