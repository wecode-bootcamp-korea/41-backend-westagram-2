const http = require("http");
const express = require("express"); // 프레임워크
const cors = require("cors");       // 백/프론트 소통 정책을 완화시켜 서로 통신하게 해 주는 패키지
const morgan = require("morgan");   // 로그 관리(주로 node 개발자들이 사용) 패키지
const dotenv = require("dotenv");   // 환경변수 관리 패키지
// nodemon => 코드 수정시 자동 재시작 해주는 패키지
dotenv.config();

const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
});

myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    });

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.get("/ping", (req, res) => {
    res.json({ message : "pong" })
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
}

start();