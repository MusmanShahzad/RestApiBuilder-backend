//Imports

    const express = require('express');
const {body,validationResult,query,param,header} = require('express-validator');
const connection = require('./../helpers/connection');
const authMiddleware = require('./../middleware/authMiddleware');
const upload = require('./../helpers/upload');

    var router = express.Router();

    

    router.get('/', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        const test=req.query.test.toString();


        return res.json(await connection.executeQuery(`Select * from first where test='${test}'`))

    });
router.post('/', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        const test=req.body.test.toString();


        return res.json(await connection.executeQuery(`Insert into first(test) Values('${test}')`))

    });
router.put('/', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        const test=req.body.test.toString();
const test=req.query.test.toString();


        return res.json(await connection.executeQuery(`Update first set test='${test}' where test='${test}'`))

    });
router.patch('/', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        


        return res.json(await connection.executeQuery(`Select * from first`))

    });
router.delete('/', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        const test=req.query.test.toString();


        return res.json(await connection.executeQuery(`Delete from first where test='${test}`))

    });


    module.exports=router;
    