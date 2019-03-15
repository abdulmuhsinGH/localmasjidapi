const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");

const UserController = require("../controllers/user.controller");
const MosqueController = require("../controllers/mosque.controller");


router.get("/", (req, res)=>{
  res
    .json({
      message:"Welcome to LocalMasjid API"	
    });
});

/*User routes*/
router.post("/user/register", UserController.register);
router.post("/user/login", UserController.login);
router.delete("/user/logout",authenticate, UserController.logout);

router.get("/user/find-mosques", MosqueController.viewMosquesNearAUser);
/*User routes*/

/*Mosque routes*/
router.post("/mosque/add", authenticate, MosqueController.addMosque);
router.get("/mosque/:id", MosqueController.viewMosqueDetails);

router.get("/mosque/:id/prayertimes", MosqueController.viewMosquePrayerTimes);
router.patch("/mosque/:id/prayertimes", authenticate, MosqueController.addPrayerTimesForAMosque);

//router.get("/mosque/near", MosqueController.viewMosquesNearAUser);
/*Mosque routes*/


module.exports = router;