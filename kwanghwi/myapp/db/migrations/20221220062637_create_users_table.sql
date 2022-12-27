-- migrate:up
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  user_id VARCHAR(200) NOT NULL,
  password VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  profile_image VARCHAR(1000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT users_ukey UNIQUE (email)
);

-- migrate:down
DROP TABLE users;