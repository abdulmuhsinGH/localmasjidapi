const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const app = require("../../server");
const User = require("../../api/model/user.model");
const {users, populateUsers} = require("./user.seed");

beforeEach(populateUsers);


describe("register users --/user/register", ()=>{
  it("should create a user with  valid data",(done)=>{
    var email ="userThree@test.com";
    var password = "user3password"
    var username = "user.3";
    var name ="userThree";

    request(app)
      .post("/user/register")
      .send({email,name,username,password})
      .expect(201)
      .expect((res)=>{
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err){
          return done(err);
        }

        User.findOne({username}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((err)=> done(err));
      });

  });

  it("should not create user with an invalid email", (done)=>{
  	var email ="userThreetest";
    var password = "user3password"
    var username = "user";
    var name ="user";

    request(app)
      .post("/user/register")
      .send({email,name,username,password})
      .expect(400)
      .end(done);

  });

  it("should not create user if email already exists",(done)=>{
    var email =users[0].email;
    var password = "user4password"
    var username = "user";
    var name ="user";

    request(app)
      .post("/user/register")
      .send({email,name,username,password})
      .expect(400)
      .end(done);

  });

  it("should not create user if username already exists",(done)=>{
    var email ="userfive@test.com";
    var password = "user5password"
    var username = users[0].username;
    var name ="userfive";

    request(app)
      .post("/user/register")
      .send({email,name,username,password})
      .expect(400)
      .end(done);

  });

  it("should not create user if password is less than 6 characters",(done)=>{
    var email ="usersix@test.com";
    var password = "user6"
    var username = users[0].username;
    var name ="userfive";

    request(app)
      .post("/user/register")
      .send({email,name,username,password})
      .expect(400)
      .end(done);

  });
});

describe("login user --/user/login", ()=>{
  it("should login user and return token", (done)=>{
    
    var username = users[0].username;
    var password = users[0].password;

    request(app)
      .post("/user/login")
      .send({username, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.username).toBe(username);
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }

        User.findById(users[0]._id).then((user)=>{

          expect(user.tokens[1]).toInclude({
            access:"auth",
          	token:res.headers["x-auth"]
          });
          done()
        }).catch((err)=>done(err));
      });

  });

  it("should not login user with correct username but incorrect password", (done)=>{
    var username = users[1].username;
    var password = users[0].password;

    request(app)
      .post("/user/login")
      .send({username, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(1);
          done()
        }).catch((err)=>done(err));
      });
  });

  it("should not login user with incorrect username but correct password", (done)=>{
    var username = "nonexisting.user";
    var password = users[0].password;

    request(app)
      .post("/user/login")
      .send({username, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end(done);

  });
});

describe("log out /user/logout", ()=>{
  it("log out user and delete token",(done)=>{
    request(app)
      .delete("/user/logout")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .end((err, res) =>{
        if(err){
          return done(err);
        }

        User.findById(users[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err)=>done(err));
      });
  });
});