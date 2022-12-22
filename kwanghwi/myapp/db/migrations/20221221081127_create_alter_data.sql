-- migrate:up
ALTER TABLE posts ADD title VARCHAR(200) NOT NULL;

-- migrate:down

