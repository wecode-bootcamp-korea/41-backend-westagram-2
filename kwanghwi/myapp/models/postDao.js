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

const selectuserPost = async (userId) => {
  const post = await appDataSource.query(
    `SELECT
        users.id,
        users.profile_image as userProfileImage,
        JSON_ARRAYAGG(JSON_OBJECT("postingId", posts.id, "postingImageUrl", posts.content_image, "postingContent", posts.content)) as postings
    FROM posts

    INNER JOIN users ON users.id = posts.user_id
    WHERE posts.user_id = ?
    GROUP BY users.id;
      `,
    [userId]
  );
  return post;
};

const patchPost = async (title, content, postId, userId) => {
  await appDataSource.query(
    `UPDATE posts SET
        title = ?,
        content = ?
    WHERE
        id = ?
    AND
        user_id = ?;
    `,
    [title, content, postId, userId]
  );

  const postRow = await appDataSource.query(
    `SELECT
        users.id as userId,
        users.name as userName,
        posts.id as postingId,
        posts.title as postingTitle,
        posts.content as postingContent
        FROM posts
    INNER JOIN users ON users.id = posts.user_id
    WHERE
        posts.id = ?
    AND
        posts.user_id = ?;
    `,
    [postId, userId]
  );
  return postRow;
};

const deletePost = async (userId, postId) => {
  const deletepost = await appDataSource.query(
    `DELETE FROM posts
      WHERE
        user_id = ?
      AND
        id = ?
    `,
    [userId, postId]
  );

  return deletepost;
};

module.exports = {
  createPost,
  selectPosts,
  selectuserPost,
  patchPost,
  deletePost,
};
