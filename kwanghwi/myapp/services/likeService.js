const likeDao = require("../models/likeDao");

const createlike = async (userId, postId) => {
  const createlike = await likeDao.createlike(userId, postId);

  return createlike;
};

module.exports = {
  createlike,
};
