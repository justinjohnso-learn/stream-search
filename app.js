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

// init session


app.listen(port, function() {
  console.log("IT'S ALIVE (on port " + port + ")")
});

app.get('/', function(req, res){
  res.render('index')
})

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------------------
// movie logic

// -------------------------------------------------------------------
// all movies

var fuzzyMovieList = []

app.get('/movies/:movieName', function(req, res){
  var movieName = req.params.movieName;
  // console.log(movieName)

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
    console.log(movies)
    // res.send(movies)
    res.render('movie_list', movies)
  }

  getMovieList(movieName)
});

// -------------------------------------------------------------------
// one movie

app.get('/movieSearch/:movieId', function(req, res){
  var movieId = req.params.movieId
  // console.log(movieId)

  var getOneMovie = function(movieId){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1/movie/' + movieId,
      function(error, meta, body){
        var data = JSON.parse(body.toString())
        parseOneMovie(data)
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
      'purchase_web_sources' : data.purchase_web_sources,
      'trailer' : data.trailers.web[0].embed
    }
    appendOneMovie(movie)
  }

  var appendOneMovie = function(movieData){
    var movie = {
      'movie' : movieData
    }
    // console.log(movie)
    // res.json(movie)
    res.render('movie_info', movie)
  }

  getOneMovie(movieId);
})

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// show logic

// -------------------------------------------------------------------
// all shows

var fuzzyShowList = []

app.get('/shows/:showName', function(req, res){
  var showName = req.params.showName;
  // console.log(showName)

  var getShowList= function(showName){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1/search/title/' + showName +'/fuzzy',
      function(error, meta, body){
        var data = JSON.parse(body.toString());
        var results = data.results;
        results.forEach(function(show){
          fuzzyShowList.push(parseShowData(show))
        })
        // console.log(fuzzyShowList)
        appendShowData(fuzzyShowList)
      }
    )
  }

  var parseShowData = function(data){
    console.log(data)
    var show = {
      'id' : data.id,
      'title' : data.title,
      'first_aired' : data.first_aired,
      'artwork' : data.artwork_608x342,
    }
    return show
    // appendShowData(show);
  }

  var appendShowData = function(fuzzyShowList){
    var shows = {
      'searchQuery' : showName,
      'shows' : fuzzyShowList
    }
    // console.log(shows)
    // res.send(shows)
    res.render('show_list', shows)
  }

  getShowList(showName)
});

// -------------------------------------------------------------------
// one show

app.get('/showSearch/:showId', function(req, res){
  var showId = req.params.showId
  // console.log(showId)

  var getOneShow = function(showId){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1/show/' + showId,
      function(error, meta, body){
        var data = JSON.parse(body.toString())
        parseOneShow(data)
      }
    )
  }

  var getAllEpisodes = function(showId){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1/show/' + showId + '/episodes/all/0/100/all/all/true',
      function(error, meta, body){
        var data = JSON.parse(body.toString())
        console.log(data)
        // parseOneShow(data)
      }
    )
  }

  var getOneEpisode = function(episodeId){

  }

  var parseOneShow = function(data){
    getAllEpisodes(showId);
    var show = {
      'id' : data.id,
      'title' : data.title,
      'first_aired' : data.first_aired,
      'network' : data.network,
      'rating' : data.rating,
      'artwork' : data.artwork_608x342,
      'overview' : data.overview,
    }
    appendOneShow(show)
  }

  var appendOneShow = function(showData){
    var show = {
      'show' : showData
    }
    // console.log(show)
    // res.json(show)
    res.render('show_info', show)
  }

  getOneShow(showId);
})
