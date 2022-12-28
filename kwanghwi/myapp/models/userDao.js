//models/userDao.js

const { appDataSource } = require("../models/dbconfig");

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

module.exports = {
  createUser,
};
