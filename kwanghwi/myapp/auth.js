// const dotenv = require("../middleware/auth");
// dotenv.config();

const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization; // (1)

    // 검증코드 작성(2)
    jwt.verify(jwtToken, process.env.secretKey);

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateToken,
};
