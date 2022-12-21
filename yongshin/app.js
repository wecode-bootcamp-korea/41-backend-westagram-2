const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const { DataSource } = require('typeorm');

const appDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
});

appDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    appDataSource.destroy()
    })

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// health check
app.get("/ping", (req, res) => {
    res.status(200).json({ "message" : "pong" });
});

app.post("/signup", async (req, res, next) => {
    const { name, email, profile_image, password } = req.body

    await appDataSource.query(
        `INSERT INTO users(
            name,
            email,
            profile_image,
            password
        ) VALUES (?, ?, ?, ?);
        `,
        [ name, email, profile_image, password ]
    );
    res.status(201).json({ message : "userCreated"});
});

app.post("/post", async (req, res, next) => {
    const { title, content, user_id } = req.body

    await appDataSource.query(
        `INSERT INTO posts(
            title,
            content,
            user_id
        ) VALUES (?, ?, ?);
        `,
        [ title, content, user_id ]
    );
    res.status(201).json({ message : "postCreated"});
});

app.get("/posts", async (req, res, next) => {
    await appDataSource.query(
        `SELECT
            posts.user_id,
            users.profile_image,
            users.id,
            posts.image_url,
            posts.content
        FROM users, posts`
    , (err, rows) => {
        res.status(200).json(rows);
    })
});

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
};

start();