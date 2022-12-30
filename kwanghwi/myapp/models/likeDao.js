const { appDataSource } = require("./dbconfig");

const createlike = async (userId, postId) => {
  const like = await appDataSource.query(
    `INSERT INTO likes(
      user_id,
      post_id
    ) VALUES (?, ?);
    `,
    [userId, postId]
  );
  return like;
};

module.exports = {
  createlike,
};
