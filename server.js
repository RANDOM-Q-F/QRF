/* eslint-disable no-unused-vars */
'use strict';

// Requires =====================================================
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const methodOverride = require('method-override');
const swalAlert = require('sweetalert');



//Middleware =====================================================
const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('js'));
app.use(express.urlencoded({ extended: true }));//To get data from body
const router = express.Router();

const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3001;
// app.use(methodOverride('_method'));



//Handel Routes ==================================================
app.get('/', handleHome);
app.get('/favorites', handleFav);
app.get('/aboutus', handleAbout);
app.get('/search', handleSearch);
router.post('/addlike', handleLike);
app.get('/quotes', handleQuotes);

//Port listener ===================================================
client.connect().then(() => {
  console.log('Connected to Database!!');
  app.listen(PORT, () => {
    console.log(`Listening to port No. ${PORT}`);
  });
});



//Routes Functions =================================================
// Home Function
function handleHome(req, res) {
  res.render('index');
}


function handleAbout(req, res) {
  res.render('about-us');
}

// search Function
function handleSearch(req, res) {
  const value = req.query.search;
  const type = req.query.searchType;
  const url = `https://goquotes-api.herokuapp.com/api/v1/all?type=${type}&val=${value}`;
  //Select Columns from DB
  // const authorColSQL = `SELECT * FROM quotes WHERE author = '${value}'`;
  // // const authorColSQL = `SELECT * FROM quotes`;

  // client.query(authorColSQL).then(dbData => {
  //   let dataFromDB = dbData.rowCount;
  //   if (dataFromDB) {
  //     res.send(dbData.rows[0]);
  //     console.log('data from DB ', dataFromDB);
  // } else {
  superagent.get(url)
    .then(apiResponse => apiResponse.body.quotes.map(quote => new Quote(quote)))
    .then(resultObjects => res.render('searches', { allQuotes: resultObjects }))
    .catch(() => { res.redirect('quotes'); });

  // }
  // });

}


// Quotes  function
function handleQuotes(req, res) {
  const url = `https://goquotes-api.herokuapp.com/api/v1/random?count=25`;
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
  const quote = req.body;
  const SQL = 'INSERT INTO quotes (quote, author, category, liked) VALUES ($1, $2, $3, $4) RETURNING liked;';

  let values = [quote.quote, quote.author, quote.category, true];

  // // const SQL2 = 'UPDATE quotes SET liked = $1 WHERE id = $2;';

  // // let values2 = [true, "parameter"];

  client.query(SQL, values)
    .then(res.jsonp({ success: quote.liked }))
    .catch(error => {
      console.log('Promise Rejection Error Being Handled');
    });


}

//Error function =====================================================
function error(err) {
  return `Oops! Something Went Wrong ${err}`;
}

