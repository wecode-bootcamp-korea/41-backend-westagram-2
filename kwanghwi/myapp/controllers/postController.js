const postService = require("../services/postService");

const posts = async (req, res) => {
  try {
    const { title, content, contentImage } = req.body;

    if (!title || !content || !contentImage) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }

    await postService.posts(title, content, contentImage, req.userId);

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

const userPost = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }
    const userpost = await postService.userpost(userId);

    res.status(201).json({ message: userpost });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const patchPost = async (req, res) => {
  try {
    const { title, content, postId, userId } = req.body;

    if (!title || !content || !postId || !userId) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }

    const patchPost = await postService.patchPost(
      title,
      content,
      postId,
      userId
    );

    res.status(201).json({ message: patchPost });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
      return res.status(400).json({ message: "KEY_ERROR" });
    }

    const deletePost = await postService.deletePost(userId, postId);

    res.status(201).json({ message: deletePost });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = {
  posts,
  list,
  userPost,
  patchPost,
  deletePost,
};
