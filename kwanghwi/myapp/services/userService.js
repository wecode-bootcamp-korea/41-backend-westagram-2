//service/userService.js

const userDao = require("../models/userDao");

const signUp = async (userId, name, password, email, profileImage) => {
  //password validation using REGEX
  const pwValidation = new RegExp("abcd");

  if (!pwValidation.test(password)) {
    const err = new Error("PASSWORD_IS_NOT_VALID");
    err.statusCode = 400;
    throw err;
  }

  const createUser = await userDao.createUser(
    userId,
    name,
    password,
    email,
    profileImage
  );

  return createUser;
};

module.exports = {
  signUp,
};
