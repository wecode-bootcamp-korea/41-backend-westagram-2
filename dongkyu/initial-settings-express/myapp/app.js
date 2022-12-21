
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

myDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")})
  .catch((err) => {
    console.log("Failed to connect Database", err)
    appDataSource.destroy();
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


//health check
app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});


const PORT = process.env.PORT;

const start = async () => {
  app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
