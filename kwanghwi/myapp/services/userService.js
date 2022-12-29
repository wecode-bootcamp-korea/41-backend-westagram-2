//service/userService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("./auth");
const userDao = require("../models/userDao");

const signUp = async (userId, name, password, email, profileImage) => {
  //password validation using REGEX
  // const pwValidation = new RegExp("abcd");

  // if (!pwValidation.test(password)) {
  //   const err = new Error("PASSWORD_IS_NOT_VALID");
  //   err.statusCode = 400;
  //   throw err;
  // }

  const createUser = await userDao.createUser(
    userId,
    name,
    password,
    email,
    profileImage
  );

  return createUser;
};

const signIn = async (userId, password) => {
  const [user] = await userDao.signinUser(userId);
  console.log("userService, [user]:", [user]);

  const match = await bcrypt.compare(password, user.password);

  const payLoad = { id: user.id };
  console.log("userService, process.env.secretKey: ", process.env.secretKey);
  const jwtToken = jwt.sign(payLoad, process.env.secretKey);

  if (!match) {
    return res.status(400).json({ message: "invalid user" });
  }

  return jwtToken;
};

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
  signUp,
  signIn,
  posts,
};
