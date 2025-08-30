const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   email:{
    type:String,
    required:true,
    unique:true
   },
   fullname:{
    firstname:{
    type:String,
    required : true
   },
   lastname:{
    type:String,
    required : true
   }
   },

   password : {
    type : String
   }
},{
    timestamps:true //isko lagane ka matlab user kab create hua tha iska time wagera sab dikhega
  }
)

const userModel = mongoose.model('user' , userSchema)

module.exports = userModel