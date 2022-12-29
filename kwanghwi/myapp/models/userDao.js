//models/userDao.js

const { appDataSource } = require("./dbconfig");

const createUser = async (email, password) => {
  // const saltRounds = 12;

  // const makeHash = async (password, saltRounds) => {
  //   return await bcrypt.hash(password, saltRounds);
  // };

  // const hashedPassword = await makeHash(password, saltRounds);

  try {
    return await appDataSource.query(
      `INSERT INTO users(
          email,
          password
        ) VALUES (?, ?);
        `,
      [email, password]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const signinUser = async (email) => {
  // console.log("userDao, userId : ", userId);

  const [user] = await appDataSource.query(
    `SELECT
      id,
      email,
      password
    FROM users
    WHERE email = ?
    `,
    [email]
  );

  // console.log("userDao, [user] : ", [user]);

  return [user];
};

const getUserById = async (id) => {
  //console.log("userDao, userId : ", id);
  console.log(id);

  const [user] = await appDataSource.query(
    `SELECT
      id,
      password
    FROM users
    WHERE id = ?;
    `,
    [id]
  );

  //console.log("userDao, user : ", user);

  console.log("user:", user);

  return user;
};

const createPost = async (title, content, contentImage, userId) => {
  const post = await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      content_image,
      user_id
    ) VALUES (?, ?, ?, ?);
    `,
    [title, content, contentImage, userId]
  );
  return post;
};

module.exports = {
  createUser,
  signinUser,
  getUserById,
  createPost,
};
