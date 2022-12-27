const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateToken } = require("./auth");

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
  const { userId, name, password, email, profileImage } = req.body;
  const saltRounds = 12;

  const makeHash = async (password, saltRounds) => {
    return await bcrypt.hash(password, saltRounds);
  };

  const hashedPassword = await makeHash(password, saltRounds);

  await appDataSource.query(
    `INSERT INTO users(
      user_id,
      name,
      password,
      email,
      profile_image
    ) VALUES (?, ?, ?, ?, ?);
    `,
    [userId, name, hashedPassword, email, profileImage]
  );
  return res.status(201).json({ message: "signup success!" });
});

app.post("/user/signin", async (req, res) => {
  const { userId, password } = req.body;

  const [user] = await appDataSource.query(
    `SELECT
      id,
      user_id,
      password
    FROM users
    WHERE user_id = ?
    `,
    [userId]
  );

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "invalid user" });
  }

  const payLoad = { id: user.id };
  const jwtToken = jwt.sign(payLoad, process.env.secretKey);

  return res.status(200).json({ data: jwtToken });
});

app.post("/posts", validateToken, async (req, res) => {
  const { title, content, contentImage } = req.body;

  await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      content_image,
      user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, content, contentImage, req.userId]
  );
  return res.status(201).json({ message: "postcreate success!" });
});

app.get("/posts", async (req, res) => {
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

app.get("/users/:userId/posts", async (req, res) => {
  const { userId } = req.params;

  const postRows = await appDataSource.manager.query(
    `SELECT
        users.id as user_id,
        users.profile_image as userProfileImage,
        JSON_ARRAYAGG(JSON_OBJECT("postingId", posts.id, "postingImageUrl", posts.content_image, "postingContent", posts.content)) as postings
    FROM posts

    INNER JOIN users ON users.id = posts.user_id
    WHERE posts.user_id = ?;
      `,
    [userId]
  );
  return res.status(200).json({ data: postRows });
});

app.patch("/post", async (req, res) => {
  const { userId, postId, title, content } = req.body;

  await appDataSource.manager.query(
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
        posts.id = ?
    AND
        posts.user_id = ?;
    `,
    [postId, userId]
  );
  return res.status(201).json({ data: postRow });
});

app.delete("/post", async (req, res) => {
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
  console.log("userId:", userId);
  console.log("postId:", postId);

  const [selectQuery] = await appDataSource.manager.query(
    `SELECT
      user_id,
      id
    FROM posts
    WHERE
      user_id = ?
    AND
      id = ?
    `,
    [userId, postId]
  );

  if (
    selectQuery.user_id != Number(userId) ||
    selectQuery.id != Number(postId)
  ) {
    await appDataSource.manager.query(
      `INSERT INTO likes(
      user_id,
      post_id
    ) VALUES (?, ?);
    `,
      [userId, postId]
    );

    return res.status(200).json({ message: "likeCreated" });
  }
  return res.status(200).json({ message: "like already exists" });
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
