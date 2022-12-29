const postService = require("../services/postService");

const posts = async (req, res) => {
  console.log(req.userId);
  try {
    const { title, content, contentImage } = req.body;

    if (!title || !content || !contentImage) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }

    await postService.posts(title, content, contentImage, req.userId);

    console.log("req.userId", req.userId);

    res.status(201).json({ message: "POSTCREATE SUCCESS" });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const list = async (req, res) => {
  try {
    const list = await postService.list();

    res.status(201).json({ message: list });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  posts,
  list,
};
