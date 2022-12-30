-- migrate:up
CREATE TABLE posts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content VARCHAR(1000) NULL,
  content_image VARCHAR(1000) NULL,
  user_id INT NULL,
  CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE posts;
