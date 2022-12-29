//service/userService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("./auth");
const userDao = require("../models/userDao");

const signUp = async (email, password) => {
  const saltRounds = 12;

  const makeHash = async (password, saltRounds) => {
    return await bcrypt.hash(password, saltRounds);
  };

  const hashedPassword = await makeHash(password, saltRounds);

  const createUser = await userDao.createUser(email, hashedPassword);

  return createUser;
};

const signIn = async (email, password) => {
  const [user] = await userDao.signinUser(email);
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
