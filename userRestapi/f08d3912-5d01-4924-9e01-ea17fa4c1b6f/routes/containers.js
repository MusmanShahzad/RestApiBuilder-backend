//Imports

    const express = require('express');
const {body,validationResult,query,param,header} = require('express-validator');
const connection = require('./../helpers/connection');
const authMiddleware = require('./../middleware/authMiddleware');
const upload = require('./../helpers/upload');

    var router = express.Router();

    

    router.get('/',[
query('container_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const container_id=req.query.container_id.toString();


        return res.json(await connection.executeQuery(`Select * from containers where container_id='${container_id}'`))

    });
router.post('/',[
body('container_no').isString().withMessage('Should be string').isLength({max:500}).withMessage('Value should be less than 500'),
body('arrived_date').isString().withMessage('Should be string'),
body('loadIng_date').isString().withMessage('Should be string'),
body('shipped_date').isString().withMessage('Should be string'),
body('status_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const container_no=req.body.container_no.toString();
const arrived_date=req.body.arrived_date.toString();
const loadIng_date=req.body.loadIng_date.toString();
const shipped_date=req.body.shipped_date.toString();
const status_id=req.body.status_id.toString();


        return res.json(await connection.executeQuery(`Insert into containers(container_no,arrived_date,loadIng_date,shipped_date,status_id) Values('${container_no}','${arrived_date}','${loadIng_date}','${shipped_date}','${status_id}')`))

    });
router.put('/',[
body('container_no').isString().withMessage('Should be string').isLength({max:500}).withMessage('Value should be less than 500'),
body('arrived_date').isString().withMessage('Should be string'),
body('loadIng_date').isString().withMessage('Should be string'),
body('shipped_date').isString().withMessage('Should be string'),
body('status_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11'),
query('container_id_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const container_no=req.body.container_no.toString();
const arrived_date=req.body.arrived_date.toString();
const loadIng_date=req.body.loadIng_date.toString();
const shipped_date=req.body.shipped_date.toString();
const status_id=req.body.status_id.toString();
const container_id_id=req.query.container_id_id.toString();


        return res.json(await connection.executeQuery(`Update containers set container_no='${container_no}',arrived_date='${arrived_date}',loadIng_date='${loadIng_date}',shipped_date='${shipped_date}',status_id='${status_id}' where container_id='${container_id_id}'`))

    });
router.patch('/', async (req, res) => {
        

        


        return res.json(await connection.executeQuery(`Select * from containers`))

    });
router.delete('/',[
query('container_id').isString().withMessage('Should be string').isLength({max:11}).withMessage('Value should be less than 11')
], async (req, res) => {
        const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
                }

        const container_id=req.query.container_id.toString();


        return res.json(await connection.executeQuery(`Delete from containers where container_id='${container_id}`))

    });


    module.exports=router;
    