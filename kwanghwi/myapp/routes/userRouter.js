const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../services/auth");

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);

module.exports = {
  router,
};
