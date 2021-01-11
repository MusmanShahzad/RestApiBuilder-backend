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
query('dfgfjd').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const dfgfjd=req.query.dfgfjd.toString();


        
return res.json(await connection.executeQuery(`Select * from fjgjkf where dfgfjd='${dfgfjd}'`));

    });
router.post('/',[
body('dfgfjd').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const dfgfjd=req.body.dfgfjd.toString();


        
return res.json(await connection.executeQuery(`Insert into fjgjkf(dfgfjd) Values('${dfgfjd}')`));

    });
router.put('/',[
body('dfgfjd').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20'),
query('dfgfjd_id').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const dfgfjd=req.body.dfgfjd.toString();
const dfgfjd_id=req.query.dfgfjd_id.toString();


        
return res.json(await connection.executeQuery(`Update fjgjkf set dfgfjd='${dfgfjd}' where dfgfjd='${dfgfjd_id}'`));

    });
router.patch('/', async (req, res) => {
        

        


        
return res.json(await connection.executeQuery(`Select * from fjgjkf`));

    });
router.delete('/',[
query('dfgfjd').isString().withMessage('Should be string').isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const dfgfjd=req.query.dfgfjd.toString();


        
return res.json(await connection.executeQuery(`Delete from fjgjkf where dfgfjd='${dfgfjd}'`));

    });


    module.exports=router;
    