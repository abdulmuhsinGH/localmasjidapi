const mongoose = require("../../db/db");
const validator = require("validator/index");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

/*console.log(validator);*/

var UserSchema = new mongoose.Schema({
  name:{type:String, required:true, minLength:1},
  email:{
    type:String, 
    required:true, 
    unique:true,
    minLength:1, 
    validate:{
      isAsync:false,
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

//
UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id:user._id.toHexString(), access},process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then(()=>{
    return token;
  })
}

UserSchema.methods.removeToken = function(token){
  var user = this;

  return user.update({
    $pull:{
    	tokens:{token}
    }
  });
}

UserSchema.statics.findUserWithCredentials = function(username,password){
  var User = this;
  
  return User.findOne({username}).then((user)=>{
  	
    if(!user){
      return Promise.reject(`${username} does not exist`);
    }

    return new Promise((resolve, reject)=> {
      bcrypt.compare(password, user.password, (err, res)=>{
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
}

UserSchema.statics.findUserByToken = function(token){
  var user = this;
  var decodedToken;

  try{
  	decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  	
  }catch(err){
    return Promise.reject();
  }

  return User.findOne({
    "_id": decodedToken._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
}

//generate hashed password before saving user 
UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = User