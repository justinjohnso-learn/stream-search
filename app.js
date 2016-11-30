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

// init fetch
const fetchUrl = require("fetch").fetchUrl;

// init bcrypt.js
const bcrypt = require('bcryptjs');


var fuzzyMovieList = []

app.listen(port, function() {
  console.log("IT'S ALIVE (on port " + port + ")")
});

app.get('/', function(req, res){
  res.render('index')
})

app.post('/movies/:movieName', function(req, res){
  var movieName = req.body.movieName;
  console.log(movieName)

  var getMovieList= function(movieName){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1/search/movie/title/' + movieName +'/fuzzy',
      function(error, meta, body){
        var data = JSON.parse(body.toString());
        var results = data.results;
        results.forEach(function(movie){
          return fuzzyMovieList.push(parseMovieData(movie))
        })
        // console.log(fuzzyMovieList)
        appendMovieData(fuzzyMovieList)
      }
    )
  }

  var parseMovieData = function(data){
    var movie = {
      'id' : data.id,
      'title' : data.title,
      'release_year' : data.release_year,
      'rating' : data.rating,
      'rottentomatoes' : data.rottentomatoes,
      'poster' : data.poster_400x570,
      // 'overview' : data.overview,
      // 'purchase_web_sources' : data.purchase_web_sources
    }
    return movie
    // appendMovieData(movie);
  }

  var appendMovieData = function(fuzzyMovieList){
    var movies = {
      'searchQuery' : movieName,
      'movies' : fuzzyMovieList
    }
    // console.log(movie)
    res.send(movies)
    // res.render('index', movies)
  }

  getMovieList(movieName)
});

app.post('/movieSearch/:movieId', function(req, res){
  var movieId = req.body.movieId
  console.log(movieId)

  var getOneMovie = function(movieId){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1/movie/' + movieId,
      function(error, meta, body){
        var data = JSON.parse(body.toString())
        // console.log(data)
        appendOneMovie(parseOneMovie(data))
      }
    )
  }

  var parseOneMovie = function(data){
    var movie = {
      'id' : data.id,
      'title' : data.title,
      'release_year' : data.release_year,
      'rating' : data.rating,
      'rottentomatoes' : data.rottentomatoes,
      'poster' : data.poster_400x570,
      'overview' : data.overview,
      'purchase_web_sources' : data.purchase_web_sources
    }
    return movie
  }

  var appendOneMovie = function(movieData){
    var movie = {
      'movies' : movie
    }
    // console.log(movie)
    // res.send(movies)
    res.render('movie_info', movie)
  }

  getOneMovie(movieId);
})



