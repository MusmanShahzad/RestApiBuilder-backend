var express = require('express');
var router = express.Router();
var {authenticationMiddleware} = require('./../middleware/auth');
const User = require('./../database/schema/User');
router.post('/', authenticationMiddleware,async (req, res)=>{
    if(req.isAuth){
        let user = await User.findById(req.userId);
        if(user){
           user.database.push(req.body);
           res.send({error:false,
            user:await user.save()})
           return;
        }
        res.send({error:true,message:'user not found',title:'not found'});
        return;
    }
    else{
        res.status(401).send('missing authorization header');
    }
})
router.delete('/', authenticationMiddleware,async (req, res)=>{
    if(req.isAuth){
        let user = await User.findByIdAndUpdate(req.userId,{
            $pull:{
               database:{_id:req.body.id} 
            }
        },{new:true});
        
        res.send({error:false,user})
        return;
    }
    else{
        res.status(401).send('missing authorization header');
    }
});
router.put('/', authenticationMiddleware,async (req, res)=>{
    try{
    if(req.isAuth){
        let user = await User.findById(req.userId);
        if(!user){
            res.send({error:true,message:'User not found',title:'not found'});
        return;
        }
        for(let i=0; i<user.database.length;i++){
            if(user.database[i]._id==req.body._id){
                user.database[i]=req.body;
                user = await user.save();
                res.send({error:false,user})
                return;
            }
        }
        res.send({error:true,message:'Database not found',title:'not found'});
        return;
        
    }
    else{
        res.status(401).send('missing authorization header');
    }
}
catch(err){
    console.log(err);
}
});
module.exports = router;