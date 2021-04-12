'use strict';

// Requires =====================================================
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const methodOverride = require('method-override');



//Middleware =====================================================
const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('js'));

const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3001;
// app.use(methodOverride('_method'));



//Handel Routes ==================================================
app.get('/', handleHome);
app.get('/favorites', handleFav);
app.get('/aboutus', handleAbout);
app.get('/quote', handleQuotes);
app.post('/addlike', handleLike);

//Port listener ===================================================
app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});


//Routes Functions =================================================
// Home Function
function handleHome(req, res) {
  res.render('index');
}


function handleAbout(req, res) {
  res.render('about-us');
}

// Quotes Function
function handleQuotes(req, res) {
  console.log(req.query);
  const countNum = req.query.search[1];
  const authorName = req.query.search[0];
  const url = `https://goquotes-api.herokuapp.com/api/v1/random/${countNum}?type=author&val=${authorName}`;
  console.log(url);
  superagent.get(url)
    .then(apiResponse => apiResponse.body.quotes.map(quote => new Quote(quote)))
    .then(resultObjects => res.render('quote', { allQuotes: resultObjects }))
    .catch(error => { res.send(`Something Went Wrong ${error}`); });
}

// Constructor Functions ============================================
function Quote(data) {
  this.quote = data.text;
  this.author = data.author;
  this.category = data.tag;
  this.liked = false;
}

// Favorite Function ================================================
function handleFav(req, res) {
  res.render('favorite');
}

// Like Function ================================================
function handleLike(req, res) {

  const quote = req;
  console.log(quote);

  // const SQL = 'INSERT INTO quotes (quote, author, category, liked) VALUES ($1, $2, $3, $4);';

  // let values = [quote.quote, quote.author, quote.category, true];

  // // const SQL2 = 'UPDATE quotes SET liked = $1 WHERE id = $2;';

  // // let values2 = [true, "parameter"];

  // client.query(SQL, values)
  //     .then(result => response.redirect(`/`))
  //     .catch(error => {
  //         console.log("Promise Rejection Error Being Handled");
  //         // response.render('pages/error', { errorText: error });
  //     });


}

//Error function =====================================================
function error(err) {
  return `Oops! Something Went Wrong ${err}`;
}

