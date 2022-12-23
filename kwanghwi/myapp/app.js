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
  const { userId, password, email, profileImage } = req.body;
  await appDataSource.query(
    `INSERT INTO users(
      user_id,
      password,
      email,
      profileImage
    ) VALUES (?, ?, ?, ?);
    `,
    [userId, password, email, profileImage]
  );
  return res.status(201).json({ message: "signup success!" });
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
