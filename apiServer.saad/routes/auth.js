const {
  login,
  register,
} = require("../controllers/userController");

const{
  subscribe
} = require("../controllers/subscriptionController")

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);

router.post("/subscribe", subscribe);

module.exports = router;