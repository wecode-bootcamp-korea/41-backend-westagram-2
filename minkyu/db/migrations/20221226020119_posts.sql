-- migrate:up
CREATE TABLE posts(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) not null,
    content varchar(2000) not null,
    user_id INT NOT NULL,
    CONSTRAINT posts_user_id_key FOREIGN KEY (user_id) REFERENCES users(id),
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
-- migrate:down
DROP TABLE posts
