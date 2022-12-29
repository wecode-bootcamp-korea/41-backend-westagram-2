//service/postService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth");
const postDao = require("../models/postDao");

const posts = async (title, content, contentImage, userId) => {
  const createPost = await postDao.createPost(
    title,
    content,
    contentImage,
    userId
  );

  return createPost;
};

const list = async () => {
  const selectPosts = await postDao.selectPosts();
  console.log("selectPosts:", selectPosts);
  return selectPosts;
};

module.exports = {
  posts,
  list,
};
