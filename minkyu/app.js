// third party packages
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { DataSource } = require('typeorm');

// custom package
const app = express();

const database = new DataSource({
    type: process.env. TYPEORM_CONNECTION,
    host: process.env. TYPEORM_HOST,
    port: process.env. TYPEORM_PORT,
    username: process.env. TYPEORM_USERNAME,
    password: process.env. TYPEORM_PASSWORD,
    database: process.env. TYPEORM_DATABASE,
})

database.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch(err=>{
        console.log("err");
    });

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.get("/ping", (req,res) =>{
    res.json({message : "pong"});
});

app.post("/posting", async(req, res) => {
    const {title, content, userId} = req.body;
    console.log(userId)
    await database.query(
        `INSERT INTO posts(
            title,
            content,
            user_id
        ) VALUES (?, ?, ?)
        `,
        [ title, content, userId ]
    );
    res.status(200).json({ message : "postCreated" });
});

app.get("/check", (req,res) =>{
    await DataSource.query(
        `SELECT
        users.id as userId,
        users.profile_image as userProfileImage,
        posts.id as postingId,
        posts.image_url as postingImageUrl 
        FROM users
        INNER JOIN posts ON users.id = posts.user_id
        `,
        res.status(200,{})
    )
})
const PORT = process.env.PORT;

const start = async () => {
    app.listen(PORT, () => console.log(`server is listenning on ${PORT}`));
};

start()