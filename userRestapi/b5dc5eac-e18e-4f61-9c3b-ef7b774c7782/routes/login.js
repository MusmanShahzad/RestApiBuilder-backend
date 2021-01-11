//Imports

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


        return res.json(await connection.executeQuery(`SQL Query`))

    });
router.post('/',[
body('name').isString().withMessage('Should be string').isLength({min:0}).withMessage('Value should be greater than 0').isLength({max:200}).withMessage('Value should be less than 200'),
body('password').isString().withMessage('Should be string').isLength({max:200}).withMessage('Value should be less than 200')
],authMiddleware, async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const name=req.body.name.toString();
const password=req.body.password.toString();


        return res.json(await connection.executeQuery(`select * from user where name='${name}' and password=${password}`))

    });
router.put('/',[
body('Name').isNumeric().withMessage('should be numeric').isFloat({min:4}).withMessage('value should be greater than 4').isFloat({max:5}).withMessage('value should be less than 5')
],authMiddleware, async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const Name=req.body.Name.toString();


        return res.json(await connection.executeQuery(`SQL Query`))

    });
router.patch('/',[
body('Name').isNumeric().withMessage('should be numeric').isFloat({min:4}).withMessage('value should be greater than 4').isFloat({max:5}).withMessage('value should be less than 5')
],authMiddleware, async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const Name=req.body.Name.toString();


        return res.json(await connection.executeQuery(`SQL Query`))

    });
router.delete('/',[
body('Name').isNumeric().withMessage('should be numeric').isFloat({min:4}).withMessage('value should be greater than 4').isFloat({max:5}).withMessage('value should be less than 5')
],authMiddleware, async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const Name=req.body.Name.toString();


        return res.json(await connection.executeQuery(`SQL Query`))

    });


    module.exports=router;
    