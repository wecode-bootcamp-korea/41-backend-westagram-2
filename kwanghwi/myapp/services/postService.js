//service/postService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("./auth");
const userDao = require("../models/userDao");

const posts = async (title, content, contentImage, userId) => {
  const createPost = await userDao.createPost(
    title,
    content,
    contentImage,
    userId
  );

  return createPost;
};

module.exports = {
  posts,
};
