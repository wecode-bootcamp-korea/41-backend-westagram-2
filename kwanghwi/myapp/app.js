const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const dotenv = require("dotenv");
dotenv.config();

const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource
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

// health check
// http -v GET 127.0.0.1:3000/ping
app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// 회원가입
// http -v POST 127.0.0.1:3000/user/signup
app.post("/user/signup", async (req, res) => {
  const { userId, password, email, profile_image } = req.body;
  await myDataSource.query(
    `INSERT INTO users(
      userId,
      password,
      email,
      profile_image
    ) VALUES (?, ?, ?, ?);
    `,
    [userId, password, email, profile_image]
  );
  res.status(201).json({ message: "signup success!" });
});

//const server = http.createServer(app);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
