DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS media_queue;

CREATE TABLE users (
  id              SERIAL       PRIMARY KEY,
  first_name      VARCHAR(255) NOT NULL,
  last_name       VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  password_digest VARCHAR(255)
);

CREATE TABLE media_queue (
  id         SERIAL       PRIMARY KEY,
  title      VARCHAR(255) NOT NULL,
  media_type VARCHAR(255) NOT NULL,
  media_id   INTEGER      NOT NULL,
  user_id    INTEGER      REFERENCES users
);

