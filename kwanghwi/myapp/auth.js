const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization;

    jwt.verify(jwtToken, process.env.secretKey);

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateToken,
};
