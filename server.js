'use strict';

require('dotenv').config();

const superagent = require('superagent');   
const pg = require('pg');
const express = require('express')
const app = express()
const port = process.env.PORT || 3001;

app.get('/', handleHome);
// app.get('/favorites', handleFav);
// app.get('/aboutus', handleAbout);
app.get('/quot', handleFQ);

app.listen(port, () => {console.log(`i'm listening at ${port}`)})



function handleHome(req,res){
  res.send('i am running');
}

// function handleFav(req, res){
//   res.send('i am running');
// }
// function handleAbout(req, res){
//   res.send('i am running');
// }
function handleFQ(req, res){
  const arr =[];
  // const search = req.query.quoty;
  // console.log(search);
  const url = `https://goquotes-api.herokuapp.com/api/v1/all/quotes`;
  

  superagent.get(url)
  .then(data => {
    // data.forEach(elem => {
    //   arr.push(elem.tag)
    // })
    // res.send(arr);
    const da = data[0];
   
    arr.push(da)
  })
}

function Quote(data){
  this.text = data.text;
  this.author =data.author;
  this.tag =data.tag;
}