const express= require('express');
const router = express.Router();
router.get('/',(req,res,next)=>{
    console.log(req.body);
    res.send(req.body);
});
router.post('/',(req,res,next)=>{
    res.send(req.body);
});
module.exports=router;