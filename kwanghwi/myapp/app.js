const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  const [selectQuery] = await appDataSource.query(
    `SELECT
      user_id,
      password
    FROM users
    WHERE user_id = ?
    `,
    [userId]
  );

  const checkHash = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  };

  const result = await checkHash(password, selectQuery.password);

  const payLoad = { password: selectQuery.password };
  const secretKey = "mySecretKey";
  const jwtToken = jwt.sign(payLoad, secretKey);

  return res.status(200).json({ data: jwtToken });
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
