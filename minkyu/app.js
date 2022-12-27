// built-in packages
// third party packages
const dotenv = require("dotenv").config();
const cors = require('cors');
const express = require('express');
const morgan = require('morgan'); 
const { DataSource } = require('typeorm');

//custom packages
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
    res.status(200).json({"message" : "pong"});
});
        // 유저 회원가입
app.post("/users", async(req, res) =>{
    const { name, email, password } = req.body;

    await database.query(
        `INSERT INTO users(
            name,
            email,
            password
        ) VALUES (?, ?, ?);
        `,
        [ name, email, password ]
    );
    res.status(200).json({ message : "successfully created" });
});

const PORT = process.env.PORT;

const start = async () => {
    app.listen(PORT, () => console.log(`server is listenning on ${PORT}`));
};

start()