const userService = require("../services/userService");

const signUp = async (req, res) => {
  try {
    const { userId, name, password, email, profileImage } = req.body;

    if (!userId || !name || !password || !email || !profileImage) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }

    await userService.signUp(userId, name, password, email, profileImage);

    res.status(201).json({ message: "SIGNUP_SUCCESS" });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  signUp,
};
