const dotenv = require("dotenv");
dotenv.config();

const userDao = require("../models/userDao");

const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  // 1) Getting token and check of it's there
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    const error = new Error("NEED_ACCESS_TOKEN");
    error.statusCode = 401;

    return res.status(error.statusCode).json({ message: error.message });
  }
  // console.log("실행확인!!");
  // console.log("auth.js, process.env.secretKey: ", process.env.secretKey);
  // console.log("auth.js, accessToken:", accessToken);
  // 2) Verification token
  const decoded = await jwt.verify(accessToken, process.env.secretKey);
  // console.log("auth.js, decoded:", decoded);

  console.log("decoded", decoded);

  if (!decoded) {
    const error = new Error("INVALID_TOKEN");
    error.statusCode = 404;

    return res.status(error.statusCode).json({ message: error.message });
  }

  // console.log("auth.js, decoded.id: ", decoded.id);

  // console.dir(
  //   "auth.js, userDao.getUserById(decoded.id): ",
  //   userDao.getUserById(decoded.id)
  // );

  console.log("decoded.id:", decoded.id);
  const user = await userDao.getUserById(decoded.id);

  console.log(user);
  //const [user] = userDao.signinUser(decoded.id);
  // console.log("auth.js, user.id:", user.id);

  if (!user.id) {
    const error = new Error("USER_DOES_NOT_EXIST");
    error.statusCode = 404;

    return res.status(error.statusCode).json({ message: error.message });
  }

  // 4) GRANT ACCESS
  console.log("??????????????????실행 확인!!");
  req.userId = user.id;
  next();
};

module.exports = {
  validateToken,
};
