const mongoose = require("../../db/db");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
  name:{type:String, required:true, minLength:1},
  email:{
    type:String, 
    required:true, 
    unique:true,
    minLength:1, 
    validator:{
   	  validator: validator.isEmail,
   	  messgae:'{VALUE} is not a valid email'
    }
   },
  username:{type:String, required:true, unique:true, minLength:5},
  password:{type:String, required:true, minLength:6},
  tokens:[{
    access:{
      type:String,
      required:true	
    },
    token:{
      type:String,
      required:true
    }
  }]
});

var User = mongoose.model('User', userSchema);

module.exports = User