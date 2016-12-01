console.log('JS working!')

// -------------------------------------------------------------------------------------------------------------------------------------------
// movie logic

function getMovieData(movieName){
  $.get('/movies/' + movieName, {movieName}, function(data) {
    console.log(data)
    // appendMovieList(data)
    // window.location.assign('/movies/' + movieName)
  });
}

var getOneMovie = function(movieId, movieTitle){
  // console.log('id', movieId);
  return $.get('/movieSearch/' + movieId, function(data) {
    // console.log(data.movie.trailer.web[0].link)
    window.location.assign('/movieSearch/' + movieId)
  });
}

var movieSearchListener = function(){
  $('#movieForm').submit(function(event) {
    // $('.movieContainer').empty();
    // $('.movieContainer').remove();
    var movieName = $('#movieForm input').val()
    getMovieData(movieName);
    event.preventDefault();
  });
};
movieSearchListener();

var movieClickListener = function(){
  $('.movie').click(function(event){
    var movieId = this.dataset.movie_id
    var movieTitle = this.dataset.movie_title
    getOneMovie(movieId, movieTitle)
  })
}
movieClickListener()

// -------------------------------------------------------------------------------------------------------------------------------------------
// show logic

function getShowData(showName){
  $.get('/shows/' + showName, {showName}, function(data) {
    // console.log(data)
    // appendshowList(data)
    window.location.assign('/shows/' + showName)
  });
}

var getOneShow = function(showId, showTitle){
  // console.log('id', showId);
  return $.get('/showSearch/' + showId, function(data) {
    // console.log(data.show.trailer.web[0].link)
    window.location.assign('/showSearch/' + showId)
  });
}

var showSearchListener = function(){
  $('#showForm').submit(function(event) {
    // $('.showContainer').empty();
    // $('.showContainer').remove();
    var showName = $('#showForm input').val()
    getShowData(showName);
    event.preventDefault();
  });
};
showSearchListener();

var showClickListener = function(){
  $('.show').click(function(event){
    var showId = this.dataset.show_id
    var showTitle = this.dataset.show_title
    getOneShow(showId, showTitle)
  })
}
showClickListener()

// var appendMovieList = function(movieList){
//   var $title, $release_year, $rating, $rottentomatoes, $poster;
//   // $('body').append('<div class="movieContainer" />');
//   $('.movieContainer').append('<div class="row"></div>');

//   // console.log($('#movieForm input').val()),
//   // console.log(movieList.searchQuery)

//   if ($('#movieForm input').val() === movieList.searchQuery){
//     movieList.movies.forEach(function(movie){
//       if ($('.movieContainer .row:last-child div').length === 3 ){
//           $('.movieContainer').append('<div class="row"></div>')
//         }
//       var $movie = $('<div />').addClass('movie')
//                                .addClass('medium-4 columns')
//                                .attr({
//                                  'data-movie_id': movie.id,
//                                  'data-movie_title': movie.title
//                                });
//       var $info = $('<div />').addClass('info');
//       $title = $('<span />').addClass('title')
//                             .text(movie.title);
//       $release_year = $('<span />').addClass('release_year')
//                             .text(movie.release_year);
//       $rating = $('<span />').addClass('rating')
//                             .text(movie.rating);
//       $poster = $('<img />').addClass('poster')
//                             .attr('src', movie.poster);
//       $('.movieContainer .row:last-child').append($movie)
//       $info.append($title, $release_year, $rating)
//       $movie.append($info, $poster)
//     });
//   }
// }

