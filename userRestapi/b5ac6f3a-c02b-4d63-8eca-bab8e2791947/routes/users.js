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
query('user_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const user_id=req.query.user_id.toString();


        
return res.json(await connection.executeQuery(`Select * from users where user_id='${user_id}'`));

    });
router.post('/',[
body('user_name').isString().withMessage('Should be string').isLength({max:250}).withMessage('Value should be less than 250'),
body('password').isString().withMessage('Should be string').isLength({max:500}).withMessage('Value should be less than 500')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const user_name=req.body.user_name.toString();
const password=req.body.password.toString();


        
return res.json(await connection.executeQuery(`Insert into users(user_name,password) Values('${user_name}','${password}')`));

    });
router.put('/',[
body('user_name').isString().withMessage('Should be string').isLength({max:250}).withMessage('Value should be less than 250'),
body('password').isString().withMessage('Should be string').isLength({max:500}).withMessage('Value should be less than 500'),
query('user_id_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const user_name=req.body.user_name.toString();
const password=req.body.password.toString();
const user_id_id=req.query.user_id_id.toString();


        
return res.json(await connection.executeQuery(`Update users set user_name='${user_name}',password='${password}' where user_id='${user_id_id}'`));

    });
router.patch('/', async (req, res) => {
        

        


        
return res.json(await connection.executeQuery(`Select * from users`));

    });
router.delete('/',[
query('user_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const user_id=req.query.user_id.toString();


        
return res.json(await connection.executeQuery(`Delete from users where user_id='${user_id}'`));

    });


    module.exports=router;
    