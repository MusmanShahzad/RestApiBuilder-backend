//Imports

    const express = require('express');
const {body,validationResult,query,param,header} = require('express-validator');
const connection = require('./../helpers/connection');
const authMiddleware = require('./../middleware/authMiddleware');
const upload = require('./../helpers/upload');

    var router = express.Router();

    

    router.get('/',[
query('test').isString().withMessage('Should be string').custom((value) => {
        
        if (!undefined.test(value)) {
          throw new Error('Invalid Value');
        }
        return true;
      })
    .isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        const test=req.query.test.toString();


        return res.json(await connection.executeQuery(`Select * from second where test='${test}'`))

    });
router.post('/',[
body('test').isString().withMessage('Should be string').custom((value) => {
        
        if (!undefined.test(value)) {
          throw new Error('Invalid Value');
        }
        return true;
      })
    .isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        const test=req.body.test.toString();


        return res.json(await connection.executeQuery(`Insert into second(test) Values '${test}'`))

    });
router.put('/',[
body('test').isString().withMessage('Should be string').custom((value) => {
        
        if (!undefined.test(value)) {
          throw new Error('Invalid Value');
        }
        return true;
      })
    .isLength({max:20}).withMessage('Value should be less than 20'),
query('test').isString().withMessage('Should be string').custom((value) => {
        
        if (!undefined.test(value)) {
          throw new Error('Invalid Value');
        }
        return true;
      })
    .isLength({max:20}).withMessage('Value should be less than 20')
], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        const test=req.body.test.toString();
const test=req.query.test.toString();


        return res.json(await connection.executeQuery(`Update second set test='${test}' where test='${test}'`))

    });
router.patch('/',, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        


        return res.json(await connection.executeQuery(`Select * from second`))

    });
router.delete('/',, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error:true,message:errors.array()[0].msg, errors: errors.array() });
        }
        


        return res.json(await connection.executeQuery(`undefined`))

    });


    module.exports=router;
    