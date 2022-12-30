const express = require("express");
const postController = require("../controllers/postController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("", auth.validateToken, postController.posts);
router.get("", postController.list);
router.get("/user/:userId", postController.userPost);
router.patch("", postController.patchPost);
router.delete("", postController.deletePost);

module.exports = {
  router,
};
