
// env variables

const dotenv = require("dotenv")
dotenv.config();

// built-in package


// third party packages
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
 


const { DataSource } = require('typeorm');

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

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.get("/ping", (req,res) =>{
    res.status(200).json({"message" : "pong"});
});

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
})

app.post("/posting", async(req, res) => {
    const {title, content, userId} = req.body;

    await database.query(
        `INSERT INTO posts(
            title,
            content,
            userId
        ) VALUES (?, ?, ?)
        `,
        [ title, content, userId ]
    );
    res.status(200).json({ message : "postCreated" });
})

const PORT = process.env.PORT;

const start = async () => {
    app.listen(PORT, () => console.log(`server is listenning on ${PORT}`));
};

start()