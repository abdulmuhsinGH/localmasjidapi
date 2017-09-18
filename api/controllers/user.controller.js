const _ = require("lodash");

const User = require("../model/user.model");



var register = async (req, res)=>{
  try{
    var body = _.pick(req.body, ["name", "email", "username", "password"]);
    var user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header("x-auth", token).status(201).send(user);
  } catch(err){
    res.status(400).send(err);
  }
 
}

var login = async (req, res)=>{
  try{
  	var body = _.pick(req.body, ['username', 'password']);
  	var user = await User.findUserWithCredentials(body.username, body.password);
  	var token = await user.generateAuthToken();

    res.header("x-auth", token).send(user);
  } catch(err){
  	
    res.status(400).send(err);
  }

}

var logout = async (req, res)=>{
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch(err){
  	console.log(err);
    res.status(400).send(err);
  }
}




module.exports = {register,login, logout}