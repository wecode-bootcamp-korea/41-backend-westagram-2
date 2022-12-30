//models/userDao.js

const { appDataSource } = require("./dbconfig");

const createUser = async (email, password) => {
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

  return [user];
};

const getUserById = async (id) => {
  const [user] = await appDataSource.query(
    `SELECT
      id,
      password
    FROM users
    WHERE id = ?;
    `,
    [id]
  );
  return user;
};

module.exports = {
  createUser,
  signinUser,
  getUserById,
};
