require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { DataSource } = require('typeorm');

const appDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
});

const app = express();

appDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    appDataSource.destroy()
    })

const PORT = process.env.PORT;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// health check
app.get("/ping", (req, res) => {
    res.status(200).json({ "message" : "pong" });
});

app.post("/signup", async (req, res, next) => {
    const { name, email, profileImage, password } = req.body

    await appDataSource.query(
        `INSERT INTO users(
            name,
            email,
            profile_image,
            password
        ) VALUES (?, ?, ?, ?);
        `,
        [ name, email, profileImage, password ]
    );

    res.status(201).json({ message : "userCreated"});
});

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
};

start();