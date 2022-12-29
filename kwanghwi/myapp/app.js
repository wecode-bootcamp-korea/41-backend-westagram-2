const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateToken } = require("./middlewares/auth");

const userRoutes = require("./routes/userRouter");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(routes);
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});

// app.get("/posts", async (req, res) => {
//   await appDataSource.query(
//     `SELECT
//             u.id as user_id,
//             u.profile_image as userProfileImage,
//             p.id as postingId,
//             p.content_image as postingImageUrl,
//             p.content as postingContent
//         FROM posts p
//     INNER JOIN users u ON u.id = p.user_id;
//     `,
//     (err, rows) => {
//       return res.status(200).json({ data: rows });
//     }
//   );
// });

// app.get("/users/:userId/posts", async (req, res) => {
//   const { userId } = req.params;

//   const postRows = await appDataSource.manager.query(
//     `SELECT
//         users.id as user_id,
//         users.profile_image as userProfileImage,
//         JSON_ARRAYAGG(JSON_OBJECT("postingId", posts.id, "postingImageUrl", posts.content_image, "postingContent", posts.content)) as postings
//     FROM posts

//     INNER JOIN users ON users.id = posts.user_id
//     WHERE posts.user_id = ?;
//       `,
//     [userId]
//   );
//   return res.status(200).json({ data: postRows });
// });

// app.patch("/post", async (req, res) => {
//   const { userId, postId, title, content } = req.body;

//   await appDataSource.manager.query(
//     `UPDATE posts SET
//         title = ?,
//         content = ?
//     WHERE
//         id = ?
//     AND
//         user_id = ?;
//     `,
//     [title, content, postId, userId]
//   );

//   const postRow = await appDataSource.manager.query(
//     `SELECT
//         users.id as userId,
//         users.name as userName,
//         posts.id as postingId,
//         posts.title as postingTitle,
//         posts.content as postingContent
//         FROM posts
//     INNER JOIN users ON users.id = posts.user_id
//     WHERE
//         posts.id = ?
//     AND
//         posts.user_id = ?;
//     `,
//     [postId, userId]
//   );
//   return res.status(201).json({ data: postRow });
// });

// app.delete("/post", async (req, res) => {
//   const { userId, postId } = req.body;

//   await appDataSource.manager.query(
//     `DELETE FROM posts
//     WHERE
//       user_id = ?
//     AND
//       id = ?
//     `,
//     [userId, postId]
//   );
//   return res.status(200).json({ message: "postingDeleted" });
// });

// app.post("/like", async (req, res) => {
//   const { userId, postId } = req.body;
//   await appDataSource.manager.query(
//     `INSERT INTO likes(
//       user_id,
//       post_id
//     ) VALUES (?, ?);
//     `,
//     [userId, postId]
//   );
//   return res.status(200).json({ message: "likeCreated" });
// });

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
