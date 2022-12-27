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
    // 게시글 등록하기
app.post("/posting", async(req, res) => {
    const {title, content, userId} = req.body;
    console.log(title, content, userId);
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
    // 게시물 조회하기
app.get("/check", async(req, res) => {
    await database.query(
        `SELECT
                users.id as userId,
                users.profile_image as userProfileImage,
                posts.id as postingId,
                posts.image_url as postingImageUrl,
                posts.content as postingContent 
            FROM posts
        INNER JOIN users ON users.id = posts.user_id;
        `,
        (err, rows) => {
            return res.status(200).json({data : rows});    
        }
    );
});
    // 유저의 게시글 조회하기
app.get("/pcheck/:userId", async(req, res) =>{
    const { userId } = req.params;
    await database.query(
        `SELECT
                users.id as userId,
                users.profile_image as userProfileImage,
                JSON_ARRAYGG(JSON_OBJECT(   "postingId", post.post_id, 
                                            "postingImage", post.image_url,
                                            "postContent", post.content)) as postings
            FROM posts
        INNER JOIN users ON users_id = posts.user_id
        WHERE posts.user_id = ?;
        `, [ userId ]
    );                                       // json_object일 경우에는 "key", value, . . . 
        return res.status(200).json({ data : pcheck });
});
const PORT = process.env.PORT;

const start = async () => {
    app.listen(PORT, () => console.log(`server is listenning on ${PORT}`));
};

start()