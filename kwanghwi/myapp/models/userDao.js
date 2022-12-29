//models/userDao.js

const { appDataSource } = require("./dbconfig");

const createUser = async (userId, name, password, email, profileImage) => {
  // const saltRounds = 12;

  // const makeHash = async (password, saltRounds) => {
  //   return await bcrypt.hash(password, saltRounds);
  // };

  // const hashedPassword = await makeHash(password, saltRounds);

  try {
    return await appDataSource.query(
      `INSERT INTO users(
          user_id,
          name,
          password,
          email,
          profile_image
        ) VALUES (?, ?, ?, ?, ?);
        `,
      [userId, name, password, email, profileImage]
    );
  } catch (err) {
    const error = new Error("INVALID_DATA_INPUT");
    error.statusCode = 500;
    throw error;
  }
};

const signinUser = async (userId) => {
  // console.log("userDao, userId : ", userId);

  const [user] = await appDataSource.query(
    `SELECT
      user_id,
      password
    FROM users
    WHERE user_id = ?
    `,
    [userId]
  );

  // console.log("userDao, [user] : ", [user]);

  return [user];
};

const getUserById = async (id) => {
  //console.log("userDao, userId : ", id);

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
