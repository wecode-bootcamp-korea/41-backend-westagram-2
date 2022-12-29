const userService = require("../services/userService");

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }

    await userService.signUp(email, password);

    res.status(201).json({ message: "SIGNUP_SUCCESS" });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }

    const token = await userService.signIn(email, password);

    res.status(201).json({ message: `${token} SIGNIN_SUCCESS` });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const posts = async (req, res) => {
  console.log(req.userId);
  try {
    const { title, content, contentImage } = req.body;

    if (!title || !content || !contentImage) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }

    await userService.posts(title, content, contentImage, req.userId);

    console.log("req.userId", req.userId);

    res.status(201).json({ message: "POSTCREATE SUCCESS" });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  signUp,
  signIn,
  posts,
};
