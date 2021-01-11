//Imports

    const express = require('express');
const {body,validationResult,query,param,header} = require('express-validator');
const connection = require('./../helpers/connection');
const authMiddleware = require('./../middleware/authMiddleware');
const upload = require('./../helpers/upload');
const env = require('dotenv').config();

    var router = express.Router();

    

    router.get('/',[
query('user_id').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const user_id=req.query.user_id.toString();


        return res.json(await connection.executeQuery(`Select * from user where user_id='${user_id}'`))

    });
router.post('/',[
body('name').isString().withMessage('Should be string').isLength({max:200}).withMessage('Value should be less than 200'),
body('password').isString().withMessage('Should be string').isLength({max:200}).withMessage('Value should be less than 200')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const name=req.body.name.toString();
const password=req.body.password.toString();


        return res.json(await connection.executeQuery(`Insert into user(name,password) Values('${name}','${password}')`))

    });
router.put('/',[
body('name').isString().withMessage('Should be string').isLength({max:200}).withMessage('Value should be less than 200'),
body('password').isString().withMessage('Should be string').isLength({max:200}).withMessage('Value should be less than 200'),
query('user_id_id').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const name=req.body.name.toString();
const password=req.body.password.toString();
const user_id_id=req.query.user_id_id.toString();


        return res.json(await connection.executeQuery(`Update user set name='${name}',password='${password}' where user_id='${user_id_id}'`))

    });
router.patch('/', async (req, res) => {
        

        


        return res.json(await connection.executeQuery(`Select * from user`))

    });
router.delete('/',[
query('user_id').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const user_id=req.query.user_id.toString();


        return res.json(await connection.executeQuery(`Delete from user where user_id='${user_id}`))

    });


    module.exports=router;
    