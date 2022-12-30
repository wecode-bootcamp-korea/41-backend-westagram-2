const dotenv = require("dotenv");
dotenv.config();

const userDao = require("../models/userDao");
//const postDao = require("../models/postDao");

const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  // 1) Getting token and check of it's there
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    const error = new Error("NEED_ACCESS_TOKEN");
    error.statusCode = 401;

    return res.status(error.statusCode).json({ message: error.message });
  }

  // 2) Verification token
  const decoded = await jwt.verify(accessToken, process.env.secretKey);

  if (!decoded) {
    const error = new Error("INVALID_TOKEN");
    error.statusCode = 404;

    return res.status(error.statusCode).json({ message: error.message });
  }
  const user = await userDao.getUserById(decoded.id);

  if (!user.id) {
    const error = new Error("USER_DOES_NOT_EXIST");
    error.statusCode = 404;

    return res.status(error.statusCode).json({ message: error.message });
  }

  // 4) GRANT ACCESS
  req.userId = user.id;
  next();
};

module.exports = {
  validateToken,
};
