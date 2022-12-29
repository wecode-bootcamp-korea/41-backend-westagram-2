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

app.post("/signup", async (req, res) => {
    const { name, email, profileImage, password } = req.body

    await appDataSource.manager.query(
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

app.post("/post", async (req, res) => {
    const { title, content, imageUrl, userId } = req.body

    await appDataSource.manager.query(
        `INSERT INTO posts(
            title,
            content,
            image_url,
            user_id
        ) VALUES (?, ?, ?, ?);
        `,
        [ title, content, imageUrl, userId ]
    );
    res.status(201).json({ message : "postCreated"});
});

app.get("/posts", async (req, res) => {
    await appDataSource.manager.query(
        `SELECT
            posts.user_id,
            users.profile_image,
            users.id,
            posts.image_url,
            posts.content
        FROM posts
        INNER JOIN users
        ON posts.user_id = users.id`
    , (err, rows) => {
        res.status(200).json({ data : rows });
    })
});

app.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

    await appDataSource.manager.query(
        `SELECT * FROM posts
        WHERE posts.id = ${postId}
        `
    ,(err, rows) => {
        res.status(200).json({ data : rows });
    });
});

app.patch("/post", async (req, res) => {
    const { title, content, imageUrl, userId } = req.body

    await appDataSource.manager.query(
        `UPDATE posts
        SET
            title = ?,
            content = ?,
            image_url = ?
        WHERE user_id = ?
        `,
        [ title, content, imageUrl, userId ]
    );

    const rows = await appDataSource.manager.query(
        `SELECT
            posts.user_id,
            users.profile_image,
            users.id,
            posts.image_url,
            posts.content
        FROM users
        JOIN posts ON users.id = posts.user_id
        WHERE posts.user_id = ?`
        , [ userId ]
    );
    res.status(201).json({ data : rows });
});

app.delete("/posts/:postId", async (req, res) => {
    const { postId } = req.params;

    await appDataSource.manager.query(
        `DELETE FROM posts
        WHERE posts.id = ${postId}
        `
    ,(err, rows) => {
        res.status(200).json({ message : "postingDeleted" });
    });
});

app.post("/like", async (req, res) => {
    const { userId, postId } = req.body

    await appDataSource.manager.query(
        `INSERT INTO likes(
            user_id,
            post_id
        ) VALUES (?, ?);
        `,
        [ userId, postId ]
    );
    res.status(201).json({ message : "likeCreated"});
});

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
};

start();