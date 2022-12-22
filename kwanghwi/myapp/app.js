const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const dotenv = require("dotenv");
dotenv.config();

const { DataSource } = require("typeorm");

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

appDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch(() => {
    console.log("Promise Rejected!");
  });

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});

app.post("/user/signup", async (req, res) => {
  const { userId, password, name, email, profileImage } = req.body;
  await appDataSource.query(
    `INSERT INTO users(
      user_id,
      password,
      name,
      email,
      profileImage
    ) VALUES (?, ?, ?, ?, ?);
    `,
    [userId, password, name, email, profileImage]
  );
  return res.status(201).json({ message: "signup success!" });
});

app.post("/post/create", async (req, res) => {
  const { title, content, content_image, userId } = req.body;
  await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      content_image,
      user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, content, content_image, userId]
  );
  return res.status(201).json({ message: "postcreate success!" });
});

app.get("/posts/get", async (req, res) => {
  await appDataSource.query(
    `SELECT
            u.id as user_id,
            u.profile_image as userProfileImage,
            p.id as postingId,
            p.content_image as postingImageUrl,
            p.content as postingContent
        FROM posts p
    INNER JOIN users u ON u.id = p.user_id;
    `,
    (err, rows) => {
      return res.status(200).json({ data: rows });
    }
  );
});

app.get("/post/get/:userId", async (req, res) => {
  const { userId } = req.params;

  await appDataSource.manager.query(
    `SELECT
        users.id as user_id,
        users.profile_image as userProfileImage,
        JSON_ARRAYAGG(JSON_OBJECT("postingId", posts.id, "postingImageUrl", posts.content_image, "postingContent", posts.content)) as postings
    FROM posts
    INNER JOIN users ON users.id = posts.user_id
    WHERE posts.user_id = ${userId};
      `,
    (err, rows) => {
      return res.status(200).json({ data: rows });
    }
  );
});

app.patch("/post/patch/", async (req, res) => {
  const { userId, postId, title, content } = req.body;

  await appDataSource.manager.query(
    `UPDATE posts SET 
        title = "${title}",
        content = "${content}"
    WHERE
        id = ${postId}
    AND
        user_id = ${userId};
    `
  );

  const postRow = await appDataSource.manager.query(
    `SELECT
        users.id as userId,
        users.name as userName,
        posts.id as postingId,
        posts.title as postingTitle,
        posts.content as postingContent
        FROM posts
    INNER JOIN users ON users.id = posts.user_id
    WHERE
        posts.id = ${postId}
    AND
        posts.user_id = ${userId};
    `
  );
  return res.status(201).json({ data: postRow });
});

app.delete("/post/delete", async (req, res) => {
  const { userId, postId } = req.body;

  await appDataSource.manager.query(
    `DELETE FROM posts
    WHERE
      user_id = ?
    AND
      id = ?
    `,
    [userId, postId]
  );
  return res.status(200).json({ message: "postingDeleted" });
});

app.post("/like", async (req, res) => {
  const { userId, postId } = req.body;

  await appDataSource.manager.query(
    `INSERT INTO likes(
      user_id,
      post_id
    ) VALUES (?, ?);
    `,
    [userId, postId]
  );
  return res.status(200).json({ message: "likeCreated" });
});

const start = async () => {
  try {
    app.listen(3000, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
