// init express
const express = require('express');
const app = express();

// init pgpromise
const port = process.env.PORT || 8000;
const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || 'postgres://Justin@localhost:5432/stream_data')

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
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);

// init session
const session = require('express-session');
app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// local variables
var GUIDEBOX_KEY = process.env.GUIDEBOX_KEY
  // || 'rKgyKajN9szgNZEi2JlcRUj6J2YXZ6D1';

// -------------------------------------------------------------------
// set up page

app.listen(port, function() {
  console.log("IT'S ALIVE (on port " + port + ")")
  console.log(GUIDEBOX_KEY);
});

app.get('/', function(req, res){
  var logged_in, first_name;
  if(req.session.user){
    logged_in = true;
    first_name = req.session.user.first_name;
  }
  var loginStatus = {
    'first_name': first_name,
    'logged_in': logged_in
  };
  console.log(loginStatus)
  res.render('index', loginStatus)
})

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------------------------------------------------------
// signup logic

app.get('/signup', function(req, res){
  var logged_in, user_id, first_name;
  if(req.session.user){
    logged_in = true;
    user_id = req.session.user.id;
    first_name = req.session.user.first_name;
  }
  var loginStatus = {
    'user_id' : user_id,
    'first_name': first_name,
    'logged_in': logged_in
  };
  console.log(loginStatus)
  res.render('signup')
});

app.post('/signup', function(req, res){
  var data = req.body;

  bcrypt.hash(data.password, 10, function(err, hash){
    db.none(
      'INSERT INTO users (first_name, last_name, email, password_digest) VALUES ($1, $2, $3, $4)', [data.first_name, data.last_name, data.email, hash]
      )
      .catch(function(user){
        res.send('Error. User could not be created.');
      })
      .then(function(){
        res.send("User Created!")
      })
      // .then(function(){
      //   setTimeout(function(){
      //     res.redirect('/');
      //   }, 1000)
      // });
  });
  console.log(data);
});

// -----------------------------------------------------------------------------------------------------------------------------------------
// login logic

app.get('/login', function(req, res){
  var logged_in, email;
  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }
  var loginStatus = {
    'logged_in': logged_in,
    'email': email
  };
  console.log(loginStatus)
  res.render('login', loginStatus)
})

app.post('/login', function(req, res){
  var data = req.body;

  db.one(
    "SELECT * FROM users WHERE email = $1",
    [data.email]
  ).catch(function(){
    res.send('Email/Password not found.')
  }).then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp){
        req.session.user = user;
        res.redirect('/');
      } else {
        res.send('Email/Password not found.')
      }
    });
  });
});

// -----------------------------------------------------------------------------------------------------------------------------------------
// movie logic

// -------------------------------------------------------------------
// all movies


app.get('/movies/:movieName', function(req, res){
  console.log(req.params.movieName)
  var logged_in, user_id, first_name;
  if(req.session.user){
    logged_in = true;
    user_id = req.session.user.id;
    first_name = req.session.user.first_name;
  }
  var loginStatus = {
    'user_id' : user_id,
    'first_name': first_name,
    'logged_in': logged_in
  };

  var movieName = req.params.movieName;
  // console.log(movieName)

  var getMovieList= function(movieName){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/' + GUIDEBOX_KEY + '/search/movie/title/' + movieName +'/fuzzy',
      function(error, meta, body){
        var fuzzyMovieList = []
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

    var data = {
      'loginStatus' : loginStatus,
      'movies' : movies
    }
    console.log(data.loginStatus)
    res.render('movie_list', data)
  }

  getMovieList(movieName)
});

// -------------------------------------------------------------------
// one movie

app.get('/movie_search/:movieId', function(req, res){

  var logged_in, user_id, first_name;
  if(req.session.user){
    logged_in = true;
    user_id = req.session.user.id;
    first_name = req.session.user.first_name;
  }
  var loginStatus = {
    'user_id' : user_id,
    'first_name': first_name,
    'logged_in': logged_in
  };

  var movieId = req.params.movieId
  // console.log(movieId)

  var getOneMovie = function(movieId){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/' + GUIDEBOX_KEY + '/movie/' + movieId,
      function(error, meta, body){
        var data = JSON.parse(body.toString())
        parseOneMovie(data)
      }
    )
  }

  var parseOneMovie = function(data){
    // var trailer;
    // if (typeof data.trailers.web[0] == undefined){
    //   trailer = 'No Trailer Available'
    // }
    // else if (typeof data.trailers.web[0] != undefined) {
    //   trailer = data.trailers.web[0].embed;
    // }
    var movie = {
      'id' : data.id,
      'title' : data.title,
      'release_year' : data.release_year,
      'rating' : data.rating,
      'rottentomatoes' : data.rottentomatoes,
      'poster' : data.poster_400x570,
      'overview' : data.overview,
      'subscription_web_sources' : data.subscription_web_sources,
      'purchase_web_sources' : data.purchase_web_sources
      // 'trailer' : trailer
    }
    appendOneMovie(movie)
  }

  var appendOneMovie = function(movieData){
    var movie = {
      'movie' : movieData
    }

    var data = {
      'loginStatus' : loginStatus,
      'movie' : movie
    }

    console.log(data.loginStatus)
    res.render('movie_info', data)
  }

  getOneMovie(movieId);
})

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// show logic

// -------------------------------------------------------------------
// all shows


app.get('/shows/:showName', function(req, res){

  var logged_in, user_id, first_name;
  if(req.session.user){
    logged_in = true;
    user_id = req.session.user.id;
    first_name = req.session.user.first_name;
  }
  var loginStatus = {
    'user_id' : user_id,
    'first_name': first_name,
    'logged_in': logged_in
  };
  console.log(loginStatus)

  var showName = req.params.showName;
  // console.log(showName)

  var getShowList= function(showName){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/' + GUIDEBOX_KEY + '/search/title/' + showName +'/fuzzy',
      function(error, meta, body){
        var fuzzyShowList = []
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

app.get('/show_search/:showId', function(req, res){

  var logged_in, user_id, first_name;
  if(req.session.user){
    logged_in = true;
    user_id = req.session.user.id;
    first_name = req.session.user.first_name;
  }
  var loginStatus = {
    'user_id' : user_id,
    'first_name': first_name,
    'logged_in': logged_in
  };
  console.log(loginStatus)

  var showId = req.params.showId
  // console.log(showId)

  var getOneShow = function(showId){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/' + GUIDEBOX_KEY + '/show/' + showId,
      function(error, meta, body){
        var data = JSON.parse(body.toString())
        parseOneShow(data)
      }
    )
  }

  var getAllEpisodes = function(showId){
    fetchUrl('https://api-public.guidebox.com/v1.43/US/' + GUIDEBOX_KEY + '/show/' + showId + '/episodes/all/0/100/all/all/true',
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

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// media_queue logic

app.get('/media_queue', function(req, res){

  var logged_in, user_id, first_name;
  if(req.session.user){
    logged_in = true;
    user_id = req.session.user.id;
    first_name = req.session.user.first_name;
  }
  var loginStatus = {
    'user_id' : user_id,
    'first_name': first_name,
    'logged_in': logged_in
  };

  db.many('SELECT * FROM media_queue WHERE user_id = $1', [user_id])
    .then(function(queue){
      var data = {
        'loginStatus' : loginStatus,
        'queue' : queue
      }
      res.render('media_queue', data)
      console.log(data);
    })
})

app.post('/media_queue', function(req, res){
  var data = req.body
  // console.log(req.body)

  db.none('INSERT INTO media_queue (title, media_type, media_id, user_id) VALUES ($1, $2, $3, $4)', [data.title, data.media_type, data.media_id, data.user_id]);

  var logged_in, user_id, first_name;
  if(req.session.user){
    logged_in = true;
    user_id = req.session.user.id;
    first_name = req.session.user.first_name;
  }
  var loginStatus = {
    'user_id' : user_id,
    'first_name': first_name,
    'logged_in': logged_in
  };
  // console.log(loginStatus)
  res.render('media_queue', loginStatus)
})

app.delete('/media_queue', function(req, res){
  console.log("delted!")
})
