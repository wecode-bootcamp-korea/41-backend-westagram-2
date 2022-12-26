// bcrypt 모듈 IMPORT
const bcrypt = require("bcrypt");

const password = "password";
// saltRounds 변수에 Cost Factor값을 할당. 8~12의 값 사용
const saltRounds = 12;

const makeHash = async (password, saltRounds) => {
  // await bcrypt.hash(암호화를 진행할 평문, Cost Fact값)
  return await bcrypt.hash(password, saltRounds);
};

const main = async () => {
  const hashedPassword = await makeHash(password, saltRounds);
  console.log("hashedPassword", hashedPassword);
};

const checkHash = async (password, hashedPassword) => {
  // compare 메소드를 이용하여 검증
  // await bcrypt.compare(비교하고싶은 평문, 암호화된 값)
  return await bcrypt.compare(password, hashedPassword); // (1)
};

const main2 = async () => {
  const hashedPassword = await makeHash("password", 12);
  const result = await checkHash("password", hashedPassword);
  console.log("result", result);
};

main();
main2();

//=======================JWT=======================
const jwt = require("jsonwebtoken");
const payLoad = { foo: "bar" };
const secretKey = "mySecretKey";

const jwtToken = jwt.sign(payLoad, secretKey);

console.log("jwtToken", jwtToken);

const decoded = jwt.verify(jwtToken, secretKey);
console.log("JWT decoded: ", decoded);
