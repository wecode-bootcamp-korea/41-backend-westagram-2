const express = require("express");
const postController = require("../controllers/postController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/posts", auth.validateToken, postController.posts);
router.get("/posts", postController.list);

module.exports = {
  router,
};
