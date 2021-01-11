//Imports

    const express = require('express');
const {body,validationResult,query,param,header} = require('express-validator');
const connection = require('./../helpers/connection');
const authMiddleware = require('./../middleware/authMiddleware');
const upload = require('./../helpers/upload');
const env = require('dotenv').config();

    var router = express.Router();

    

    router.get('/',[
query('name').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const name=req.query.name.toString();


        return res.json(await connection.executeQuery(`Select * from first where name='${name}'`))

    });
router.post('/',[
body('name').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const name=req.body.name.toString();


        return res.json(await connection.executeQuery(`Insert into first(name) Values('${name}')`))

    });
router.put('/',[
body('name').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20'),
query('name_id').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const name=req.body.name.toString();
const name_id=req.query.name_id.toString();


        return res.json(await connection.executeQuery(`Update first set name='${name}' where name='${name_id}'`))

    });
router.patch('/', async (req, res) => {
        

        


        return res.json(await connection.executeQuery(`Select * from first`))

    });
router.delete('/',[
query('name').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const name=req.query.name.toString();


        return res.json(await connection.executeQuery(`Delete from first where name='${name}`))

    });


    module.exports=router;
    