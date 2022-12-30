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

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
