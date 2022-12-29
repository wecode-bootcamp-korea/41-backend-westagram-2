const { appDataSource } = require("./dbconfig");

const createPost = async (title, content, contentImage, userId) => {
  const post = await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      content_image,
      user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, content, contentImage, userId]
  );
  return post;
};

const selectPosts = async () => {
  const post = await appDataSource.query(
    `SELECT
            u.id as user_id,
            u.profile_image as userProfileImage,
            p.id as postingId,
            p.content_image as postingImageUrl,
            p.content as postingContent
        FROM posts p
    INNER JOIN users u ON u.id = p.user_id;
    `
  );
  return post;
};

module.exports = {
  createPost,
  selectPosts,
};
