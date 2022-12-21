const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const { DataSource } = require("typeorm");
const { allowedNodeEnvironmentFlags } = require("process");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//health check
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

//create a userInfo
app.post("/postman", async (req, res, next) => {
  const { name, age, email } = req.body;

  await myDataSource.query(
    `INSERT INTO userInfo(
      name,
      age,
      email) VALUES (?, ?, ?);
      `,
    [name, age, email]
  );
  res.status(201).json({ message: "sucessfully created" });
});

//Create a book

app.post("/userInfo", async (req, res, next) => {
  const { title, description, coverImage } = req.body;

  //console.log(req)

  await myDataSource.query(
    `INSERT INTO books(
      title,
      description,
      cover_image
      ) VALUES (?, ?, ?);
    `,
    [title, description, coverImage]
  );
  res.status(201).json({ message: "successfully created" });
});

//Get all books
// app.get("/books", async (req, res) => {
//   await myDataSource.manager.query(
//     `SELECT
//       b.id,
//       b.title,
//       b.description,
//       b.cover_image
//     FROM books as b`,

//     (err, rows) => {
//       res.status(200).json(rows);
//     }
//   );
// });

//Get all books along with authors
// app.get("/books-authors", (req, res) => {
//   myDataSource.query(
//     `SELECT
//           books.id,
//           books.title,
//           books.description,
//           books.cover_image,
//           authors.first_name,
//           authors.last_name,
//           authors.age
//       FROM books_authors ba
//       INNER JOIN authors ON ba.author_id = authors.id
//       INNER JOIN books ON ba.book_id = books.id`,
//     (err, rows) => {
//       console.log(err);
//       res.status(200).json(rows);
//     }
//   );
// });

// app.patch("/books", async (req, res) => {
//   const { title, description, coverImage, bookId } = req.body;

//   await myDataSource.query(
//     `UPDATE books
//     SET
//       title = ?,
//       description = ?,
//       cover_image = ?
//       WHERE id = ?`,
//     [title, description, coverImage, bookId]
//   );
//   res.status(201).json({ message: "successfully updated" });
// });

//Delete a book
// app.delete("/books/:bookId", async (req, res) => {
//   const { bookId } = req.params;

//   await myDataSource.query(
//     `DELETE FROM books
//     WHERE books.id = ${bookId}`
//   );
//   res.status(204).json({ message: "successfully deleted" });
// });
const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
