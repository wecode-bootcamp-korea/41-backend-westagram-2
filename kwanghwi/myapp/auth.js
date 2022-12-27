const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization;

    const tokenId = jwt.verify(jwtToken, process.env.secretKey);

    req.userId = tokenId.id;

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Access Token" });
    next(err);
  }
};

module.exports = {
  validateToken,
};
