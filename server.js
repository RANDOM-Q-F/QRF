'use strict';



// Requires =====================================================
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const methodOverride = require('method-override');

// const sweetalert = require('sweetalert');

//Middleware =====================================================
const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('img'));
app.use(express.static('public'));
app.use(express.static('js'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
const PORT = process.env.PORT || 3001;
// const router = express.Router();
// app.use(methodOverride('_method'));



//Handel Routes ==================================================
app.get('/', handleHome);
app.get('/favorite', handleFav);
app.get('/about-us', handleAbout);
app.get('/search', handleSearch);
app.post('/addlike', handleLike);
app.get('/quote', handleQuotes);
app.delete('/quote', deleteQuoti);

app.use('*', (request, response) => response.status(404).send('This route does not exist'));

//Port listener ===================================================
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`app is listning on port ${PORT}`);
  });
}).catch(err => {
  console.log(`Sorry there is Database error ${err}`);
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
  // const countNum = req.query.search[1];
  const value = req.query.search;
  const type = req.query.searchType;
  // const url = `https://goquotes-api.herokuapp.com/api/v1/random/${countNum}?type=${type}&val=${value}`;

  const url = `https://goquotes-api.herokuapp.com/api/v1/all?type=${type}&val=${value}`;


  superagent.get(url)
    .then(apiResponse => apiResponse.body.quotes.map(quote => new Quote(quote)))
    .then(resultObjects => res.render('searches', { allQuotes: resultObjects }))
    .catch(error => { res.send(`Something Went Wrong ${error}`); });
}


// qoutes  function
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
  const sql = 'SELECT * FROM quotes;';
  client.query(sql).then(dataDB => {
    //   if (dataDB.rowCount) {

    // res.render('favorite');
    res.render('favorite', { quotes: dataDB.rows });
    //   }else{
    //     res.render('favorite', { quotes: dataDB.rows[0] });
    //   }
  }).catch(error => {
    res.send('notfound');
  });

}

// Like Function ================================================
function handleLike(req, res) {
  const quote = req.body;
  const SQL = 'INSERT INTO quotes (quote, author, category, liked) VALUES ($1, $2, $3, $4);';
  let values = [quote.quote, quote.author, quote.category, true];
  client.query(SQL, values)
    .then(result => { res.redirect('/quote'); })
    .catch(error => {
      console.log('Promise Rejection Error Being Handled');
    });

}
// Delete Function ================================================
function deleteQuoti(req, res) {
  let id = req.body.id;
  let SQL = 'DELETE FROM quotes WHERE id=$1';
  client.query(SQL, [id]).then(result => {
    res.redirect('/favorite');
  });
}
//Error function =====================================================
function error(err) {
  return `Oops! Something Went Wrong ${err}`;
}
