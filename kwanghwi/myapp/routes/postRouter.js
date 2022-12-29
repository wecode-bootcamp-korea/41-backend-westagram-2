const express = require("express");
const postController = require("../controllers/postController");
const auth = require("../services/auth");

const router = express.Router();

router.post("/posts", auth.validateToken, postController.posts);

module.exports = {
  router,
};
