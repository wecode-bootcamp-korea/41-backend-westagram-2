
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

app.get("/pings", (req,res) =>{
    res.status(201).json({"message" : "pong"});
});

app.post("/users", async(req, res) =>{
    const { id, name, email, password } = req.body;

    // console.log(req)

    await database.query(
        `INSERT INTO users(
            id,
            name,
            email,
            password
        ) VALUES (?, ?, ?, ?);
        `,
        [ id, name, email, password ]
    );

    res.status(201).json({ message : "successfully created" });
})



const PORT = process.env.PORT;

const start = async () => {
    app.listen(PORT, () => console.log(`server is listenning on ${PORT}`));
};

start()