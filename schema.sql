DROP TABLE IF EXISTS quotes;
CREATE TABLE IF NOT EXISTS quotes(
  id SERIAL PRIMARY KEY,
  quote TEXT NOT NULL,
  author VARCHAR (255),
  category VARCHAR (255),
  liked BOOLEAN
);

INSERT INTO quotes (quote, author, category, liked) 
VALUES('Hello, World!', 'Team301', 'Proof of Life', false);