const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
  .catch((err) => {
    console.log("Failed to connect Database", err);
    appDataSource.destroy();
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});

app.post("/users", async (req, res) => {
  const { name, age, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  await appDataSource.query(
    `INSERT INTO users(
      name,
      age,
      email,
      password
    ) VALUES (?, ?, ?, ?);  
    `,
    [name, age, email, hashedPassword]
  );

  res.status(201).json({ message: "userCreated" });
});

app.post("/posts", async (req, res) => {
  const { title, content, userId } = req.body;

  await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      user_id
    ) VALUES (?, ?, ?);
    `,
    [title, content, userId]
  );

  res.status(201).json({ message: "postCreated" });
});

app.get("/posts", async (req, res) => {
  const rows = await appDataSource.query(
    `SELECT
            users.id as userId,
            users.age,
            users.email,
            users.password,
            posts.id as postingId,
            posts.title,
            posts.content
      FROM users
      INNER JOIN posts
      ON users.id = posts.user_id
    `
  );

  res.status(200).json({ data: rows });
});

app.get("/users/:userId/posts", async (req, res) => {
  const { userId } = req.params;

  const rows = await appDataSource.query(
    `SELECT
        users.id,
        users.name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
          "postingId", posts.id,
          "postingTitle", posts.title,
          "postingContent", posts.content
          )
        ) as postings
      FROM users
      JOIN posts
      ON users.id = posts.user_id AND users.id = ?
      GROUP BY users.id`,
    [userId]
  );

  res.status(200).json({ data: rows });
});

app.patch("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  const { title, content, userId } = req.body;

  await appDataSource.query(
    `UPDATE posts
        SET 
          title = ?,
          content = ?
        WHERE user_id = ?
      `,
    [title, content, userId]
  );

  const rows = await appDataSource.query(
    `SELECT
        users.id as userId,
        users.name as userName,
        posts.id as postingId,
        posts.title as postingTitle,
        posts.content as postingContent
      FROM users
      JOIN posts
      ON users.id = posts.user_id AND posts.id = ?
      `,
    [postId]
  );

  res.status(201).json({ data: rows });
});

app.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  await appDataSource.query(
    `DELETE FROM posts
        WHERE posts.id = ?
        `,
    [postId]
  );
  res.status(200).json({ message: "postingDeleted" });
});

app.post("/likes", async (req, res) => {
  const { userId, postId } = req.body;

  await appDataSource.query(
    `INSERT INTO likes (
        user_id,
        post_id
      ) VALUES (?, ?);
      `,
    [userId, postId]
  );
  res.status(201).json({ message: "likeCreated" });
});

app.get("/login", async (req, res) => {
  const { email } = req.body;

  const [userId] = await appDataSource.query(
    `SELECT
    users.id
    FROM users
    WHERE email = ?`,
    [email]
  );
  const payLoad = { userId: userId.id };
  const secretKey = "mySecretKey";
  const jwtToken = jwt.sign(payLoad, secretKey);

  const [userData] = await appDataSource.query(
    `SELECT 
    users.password
    FROM users
    WHERE email = ?`,
    [email]
  );

  const hashedPassword = userData.password;
  const password = req.body.password;

  const checkHash = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  };

  const main = async () => {
    const result = await checkHash(password, hashedPassword);
    if (result) {
      return res.status(200).json({ accessToken: jwtToken });
    } else {
      res.status(200).json({ message: "Invalid User" });
    }
  };
  main();
});

const PORT = process.env.PORT;

const start = async () => {
  app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
