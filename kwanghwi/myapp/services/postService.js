//service/postService.js
const postDao = require("../models/postDao");

const posts = async (title, content, contentImage, userId) => {
  const createPost = await postDao.createPost(
    title,
    content,
    contentImage,
    userId
  );

  return createPost;
};

const list = async () => {
  const selectPosts = await postDao.selectPosts();

  return selectPosts;
};

const userpost = async (userId) => {
  const selectuserPost = await postDao.selectuserPost(userId);

  return selectuserPost;
};

const patchPost = async (title, content, postId, userId) => {
  const patchPost = await postDao.patchPost(title, content, postId, userId);

  return patchPost;
};

const deletePost = async (userId, postId) => {
  const deletePost = await postDao.deletePost(userId, postId);

  return deletePost;
};

module.exports = {
  posts,
  list,
  userpost,
  patchPost,
  deletePost,
};
