// third party packages
require("dotenv").config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const morgan = require('morgan');
const { DataSource } = require('typeorm');

// custom package
const app = express();
const password = 'password';

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
    res.status(200).json({message : "pong"});
});

app.post("/users", async(req, res) =>{
    const { name, email, password } = req.body;
    const saltRounds = 12;

    const makeHash = async(password, saltRounds) => {
        return await bcrypt.hash(password, saltRounds);
    }
    const hashedPassword = await makeHash(password, saltRounds);

    await database.query(
        `INSERT INTO users(
            name,
            email,
            password
        ) VALUES (?, ?, ?);
        `,
        [ name, email, hashedPassword ]
    );
    res.status(201).json({ message : "successfully created" });
});

app.post("users/signin", async( req, res ) =>{
    const { userId, password } = req.body;

    const [user] = await database.query(
        `SELECT
            user_id,
            password
        FROM users
        WHERE user_id = ?
        `, [ userId ]
    );

    const match = await bcrypt.compare(password, user.password);

    if (!match){
        return res.status(400).json({ meesage : "invalid user" });
    }

    const payLoad = { id: user.id };
    const jwtToken = jwt.sign(payLoad, process.env.secretKey);

    return status(200).json({ data: jwtToken });
});

app.post("/posting", async(req, res) => {
    const {title, content, userId} = req.body;
    await database.query(
        `INSERT INTO posts(
            title,
            content,
            user_id
        ) VALUES (?, ?, ?)
        `,
        [ title, content, userId ]
    );
    res.status(201).json({ message : "postCreated" });
});

app.get("/post", async(req, res) => {
    const result = await database.query(
        `SELECT
                users.id as userId,
                users.profile_image as userProfileImage,
                posts.id as postingId,
                posts.image_url as postingImageUrl,
                posts.content as postingContent 
        FROM posts
        JOIN users ON users.id = posts.user_id;
        `
    );
    return res.status(200).json({data : result}); 
});

app.get("/user/:userId/post", async(req, res) =>{
    const { userId } = req.params;
    const postRows = await database.query(
        `SELECT
                users.id as userId,
                users.profile_image as userProfileImage,
                JSON_ARRAYAGG(JSON_OBJECT(   "postingId", posts.id, 
                                            "postingImage", posts.image_url,
                                            "postContent", posts.content)) as postings
        FROM posts
        JOIN users ON users.id = posts.user_id
        WHERE posts.user_id = ?;
        `, [ userId ]
    );                                        
        return res.status(201).json({ data : postRows });
});

app.patch("/post/:postId", async (req, res) => {
    const postId = req.params.postId;
    const { content } = req.body;
    await database.query(
        `UPDATE posts SET content = ? 
        WHERE id = ?;
        `,[ content, postId ]
    );

    const result = await database.query(
      `SELECT
             users.id as userId,
             users.name as userName,
             posts.id as postingId,
             posts.title as postingTitle,
             posts.content as postingContent
      FROM users 
      JOIN posts ON users.id = posts.user_id
      WHERE posts.id = ?;
      `, [ postId ]
    );
  
    res.status(201).json({ data : result });
  });

const PORT = process.env.PORT;

const start = async () => {
    app.listen(PORT, () => console.log(`server is listenning on ${PORT}`));
};

start()