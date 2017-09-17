const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");

const UserController = require("../controllers/user.controller");


router.get("/", (req, res)=>{
  res
    .json({
      message:"Welcome to LocalMasjid API"	
    });
});

/*User routes*/
router.post("/user/register", UserController.register);
router.get("/user/login", UserController.login);
router.delete("/user/logout",authenticate, UserController.logout);
/*User routes*/


module.exports = router