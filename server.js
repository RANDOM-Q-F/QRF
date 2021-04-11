'use strict';

// Requires =====================================================
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');


//Middleware =====================================================
const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3001;


//Handel Routes ==================================================
app.get('/', handleHome);
// app.get('/favorites', handleFav);
// app.get('/aboutus', handleAbout);
app.get('/quote', handleFQ);


//Port listener ===================================================
app.listen(PORT, () => {
  console.log(`i'm listening at ${PORT}`);
});


//Routes Functions =================================================
// Home Function
function handleHome(req, res) {
  res.render('index');
}

// Favorite Function
// function handleFav(req, res){
//   res.send('i am running');
// }
// function handleAbout(req, res){
//   res.send('i am running');
// }

// Quotes Function
function handleFQ(req, res) {
  const arr = [];
  const url = 'https://goquotes-api.herokuapp.com/api/v1/random?count=15';
  superagent.get(url)
    .then(results => {
      const data = results.body.quotes;
      //Adding quotes to the array to make the drop list
      data.forEach(element => {
        if (!arr.includes(element.tag) && element.tag) {
          arr.push(element.tag);
        }
      });

      res.render('quote', {
        list: arr,
        allQuote: data
      });
    }).catch((err) => { error(err); });
}

// Constructor Functions ============================================
function Quote(data) {
  this.quote = data.text;
  this.author = data.author;
  this.category = data.tag;
}

//Error function =====================================================
function error(err) {
  return `Oops! Something Went Wrong ${err}`;
}
