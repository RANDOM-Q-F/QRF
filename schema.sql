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

INSERT INTO quotes (quote, author, category, liked) 
VALUES('Gay marriage has jumped out of the closet on to the front page. Everyone from the president of the U.S. to retired four-star general Colin Powell is embracing the issue, now supported by most Americans. Still, a few people, like former First Lady Laura Bush appear to be conflicted.',
'Kitty Kelley',
'marriage',
false);


INSERT INTO quotes (quote, author, category, liked) 
VALUES('I definitely spend the most money on shoes, partly because vintage footwear can be a little funky - in a bad way. I like to keep things pretty simple up top and then go weird with the shoes.',
'Chloe Sevigny',
'money',
false);

INSERT INTO quotes (quote, author, category, liked) 
VALUES('Beauty comes from a life well lived. If youve lived well, your smile lines are in the right places, and your frown lines arent too bad, what more do you need?',
'Chloe Sevigny',
'beauty',
false);


