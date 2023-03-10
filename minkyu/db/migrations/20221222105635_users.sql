-- migrate:up
CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) not null,
    email varchar(200) not null,
    profile_image varchar(1000) null,
    password varchar(200) not null,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);

-- migrate:down
DROP TABLE users;
