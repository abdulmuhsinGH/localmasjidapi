const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");

const User = require("../../api/model/user.model");

const seedUserOneObjId = new ObjectID();
const seedUserTwoObjId = new ObjectID();

const users =[{
  _id:seedUserOneObjId,
  email:"userOne@test.com",
  name:"userOne",
  username:"user.one",
  password:"useronepassword",
  tokens:[{
    access:"auth",
    token: jwt.sign({_id:seedUserOneObjId, access:"auth"}, process.env.JWT_SECRET).toString()
  }]
},{
  _id:seedUserTwoObjId,
  email:"userTwo@test.com",
  name:"userTwo",
  username:"user.two",
  password:"usertwopassword",
  tokens:[{
    access:"auth",
    token: jwt.sign({_id:seedUserTwoObjId, access:"auth"}, process.env.JWT_SECRET).toString()
  }]
}]

const populateUsers = (done)=>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(()=> done());
}

module.exports = {users,populateUsers};