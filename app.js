// init express
const express = require('express');
const app = express();

// init pgpromise
const port = process.env.PORT || 8000;
const pgp = require('pg-promise')();
const db = pgp('postgres://Justin@localhost:5432/stream_data')

// init mustache
const mustache = require('mustache-express');
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// init body parser
const bdPars = require('body-parser'); //body parser
app.use(bdPars.urlencoded({ extended: false })); //body parser
app.use(bdPars.json()); //body parser

// init method_override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// init node-fetch
var fetch = require('node-fetch');

// init bcrypt.js
const bcrypt = require('bcryptjs');

app.listen(port, function() {
  console.log("IT'S ALIVE (on port " + port + ")")
});

app.get('/', function(req, res){
  res.render('index')
})

app.post('/movies', function(req, res){
  var movieName = req.body.movieName;
  var movieIDs = [];
  fetch('https://api-public.guidebox.com/v1.43/US/rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1/search/movie/title/' + movieName +'/fuzzy')
    .then(function(fetchRes){
      return fetchRes.json()
    })
    .then(function(data){
      data.results.forEach(function(movie){
        movieIDs.push(movie.id);
      })
      console.log(movieIDs);
    // res.render('index', movies);
    })
})

var getMovie = function(id){
  app.get('/movies', function(req, res){
    fetch('https://api-public.guidebox.com/v1.43/US/rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1/movie/' + id)
    .then(function(fetchRes){
      return fetchRes.json()
    })
    .then(function(data){
      var
    })
  })
}
// app.get('/show', function(req, res){
//   getShow(req.body.showName);
//   res.redirect('/');
// })

// var showMovie = function(data){
//   app.get('/', function(req, res){
//   console.log (data);
//   res.render('index', data)
//   })
// }

// var getMovie = function(movieName){
//   fetch('https://api-public.guidebox.com/v1.43/US/rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1/search/movie/title/' + movieName +'/fuzzy')
//       .then(function(res){
//         return res.json()
//       })
//       .then(function(data){

//       });
// }


// var getShow = function(){
//   fetch('https://api-public.guidebox.com/v1.43/US/rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1/search/movie/title/' + showName +'/fuzzy')  .then(function(res){
//         return res.json()
//       })
//       .then(function(data){
//         console.log(data)
//       });
// }
