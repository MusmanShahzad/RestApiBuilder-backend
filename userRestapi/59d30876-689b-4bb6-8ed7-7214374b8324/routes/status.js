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
query('status_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const status_id=req.query.status_id.toString();


        
return res.json(await connection.executeQuery(`Select * from status where status_id='${status_id}'`));

    });
router.post('/',[
body('name').isString().withMessage('Should be string').isLength({max:250}).withMessage('Value should be less than 250')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const name=req.body.name.toString();


        
return res.json(await connection.executeQuery(`Insert into status(name) Values('${name}')`));

    });
router.put('/',[
body('name').isString().withMessage('Should be string').isLength({max:250}).withMessage('Value should be less than 250'),
query('status_id_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const name=req.body.name.toString();
const status_id_id=req.query.status_id_id.toString();


        
return res.json(await connection.executeQuery(`Update status set name='${name}' where status_id='${status_id_id}'`));

    });
router.patch('/', async (req, res) => {
        

        


        
return res.json(await connection.executeQuery(`Select * from status`));

    });
router.delete('/',[
query('status_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const status_id=req.query.status_id.toString();


        
return res.json(await connection.executeQuery(`Delete from status where status_id='${status_id}'`));

    });


    module.exports=router;
    