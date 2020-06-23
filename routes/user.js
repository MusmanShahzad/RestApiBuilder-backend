const env = require('dotenv').config();
const jwt = require("jsonwebtoken");
const multer = require('multer');
const storage = multer.diskStorage({ destination:(req,file,callback)=>{
callback(null,'./upload');
},
filename:(req,file,callback)=>{
callback(null,Math.random()+file.originalname);
}})
var upload = multer({storage})
const User =  require('./../database/schema/User');
var express = require('express');
var router = express.Router();
var {authenticationMiddleware} = require('./../middleware/auth');
router.post('/', upload.single('file'),async (req, res) => {
    let data = JSON.parse(req.body.data);
    let temp = ((await User.find({email:data.email})))
    if(temp.length>0){
        res.send({
            error:true,
            message:'Email ALready Exits',
            title:'Duplicate'
            });
            return;
    }
    let user = new User({
        name: data.name,
        email: data.email,
        password: data.password,
        avatar: `upload/${req.file.filename}`
    });
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "15d",
        }
      );
    res.send({
        error:false,
        user:await user.save(),
        token
});
});
router.post('/login', async (req, res)=>{
  let user = await User.find({ email:req.body.email,password:req.body.password});
  if(user.length>0){
    user = user[0];
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15d",
      }
    );
  res.send({
      error:false,
      user,
      token
});
  }
  else{
    res.send({
      error:true,
      message:'Email or password is incorrect',
      title:'not found'
    });
  }
});
router.get('/',authenticationMiddleware,async (req,res) =>{
  if(req.isAuth){
    let user = await User.findById(req.userId);
    res.send({
      user
    })
  }
  else{
    res.status(401).send('not authorized');
    return;
  }
})
module.exports = router;