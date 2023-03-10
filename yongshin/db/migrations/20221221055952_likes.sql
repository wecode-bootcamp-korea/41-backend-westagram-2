-- migrate:up
CREATE TABLE likes (
	id INT NOT NULL,
	user_id INT NOT NULL,
	post_id INT NOT NULL,
	PRIMARY KEY(id, user_id, post_id),
	CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
	CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id));

-- migrate:down
DROP TABLE likes;
