const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function registerUser(req,res){
 const{fullname:{firstname , lastname}, email , password } = req.body

 const isUserExist = await userModel.findOne({email})

 if(isUserExist){
    return res.status(400).json({
        message: "user already exists"
    })
 }

 const hashPassword = await bcrypt.hash(password , 10)

 const user = await userModel.create({
    fullname:{
        firstname,
        lastname
    },
    email,
    password : hashPassword
 })

 const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

 res.cookie('token' , token)

 res.status(201).json({
    message:"user registered sucessfully",
    user:{
        email : email,
        _id : user._id,
        fullname : user.fullname
    }
 })
}

async function loginUser(req,res){
   const{email,password} = req.body

   const user = await userModel.findOne({
    email
   })
   if(!user){
    return res.status(400).json({
        message : "user not found might be wrong password or email"
    })
   }
   const isPasswordValid = await bcrypt.compare(password , user.password)

   if(!isPasswordValid){
        return res.status(400).json({
            message: "invalid password"
        })
   }
   const token = jwt.sign({id : user._id} , process.env.JWT_SECRET)

   res.cookie("token" , token)

   return res.status(200).json({
    message:"user logged in sucessfully",
    user:{
         email : email,
        _id : user._id,
        fullname : user.fullname
    }
   })
}


module.exports = {registerUser , loginUser}