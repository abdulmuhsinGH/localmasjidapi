const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const app = require("../../server");
const Mosque = require("../../api/model/mosque.model");
const {users} = require("../user/user.seed");
const {populateMosques} = require("./mosque.seed");

beforeEach(populateMosques);


describe("Add Mosque --/mosque/add",()=>{
  it("should add mosque and return",(done)=>{
    var name ="Mosque";
    var location = [-0.029200, 5.664092];

    request(app)
      .post("/mosque/add")
      .set("x-auth", users[0].tokens[0].token)
      .send({name,location})
      .expect(200)
      .expect((res)=>{
      	expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.name).toBe(name);
        
      })
      .end((err)=>{
        if(err){
          return done(err);
        }

        Mosque.find({name}).then((mosque)=>{
          expect(mosque).toExist();
          done();
        }).catch((err)=>done(err));
      });
  });

  it("should not add mosque from unauthorized user",(done)=>{
    var name ="Mosque 2";
    var location = [-0.029200, 5.664092];

    request(app)
      .post("/mosque/add")
      .send({name,location})
      .expect(401)
      .end(done);
  });

})