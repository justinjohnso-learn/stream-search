console.log('JS working!')

// -------------------------------------------------------------------------------------------------------------------------------------------
// movie logic

function getMovieData(movieName){
  $.get('/movies/' + movieName, function(data) {
    // console.log(data)
    // appendMovieList(data)
    window.location.assign('/movies/' + movieName)
  });
}

var getOneMovie = function(movieId, movieTitle){
  // console.log('id', movieId);
  return $.get('/movie_search/' + movieId, function(data) {
    // console.log(data.movie.trailer.web[0].link)
    window.location.assign('/movie_search/' + movieId)
  });
}

var movieSearchListener = function(){
  // console.log('listeners')
  $('#movieForm').submit(function(event) {
    // $('.movieContainer').empty();
    // $('.movieContainer').remove();
    var movieName = $('#movieForm input').val()
    console.log(movieName)
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
  return $.get('/show_search/' + showId, function(data) {
    window.location.assign('/show_search/' + showId)
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

// -------------------------------------------------------------------------------------------------------------------------------------------
// media_queue logic

var postToQueue = function(data){
  return $.post('/media_queue/', data, function(data){
    $('.queueButton').text('Added!')
                     .removeClass('queueButton')
                     .css('backgroundColor', 'green');
  });
}

var addToQueueListener = function(){
  $('.queueButton').on('click', function(event){
    var movie = $(this).parent().parent().parent().siblings('.movieContainer').find('.movie');
    var nav = $(this).parent();
    var data = {
      'title' : movie[0].dataset.movie_title,
      'media_id' : movie[0].dataset.movie_id,
      'media_type' : movie[0].dataset.media_type,
      'user_id' : this.dataset.user_id
    }
    console.log(data)
    postToQueue(data)
  })
}
addToQueueListener()

var removeFromQueueListener = function(){
  $('.queueButton').on('click', function(event){
    var movie = $(this).parent().parent().parent().siblings('.movieContainer').find('.movie');
    var nav = $(this).parent();
    var data = {
      'title' : movie[0].dataset.movie_title,
      'media_id' : movie[0].dataset.movie_id,
      'media_type' : movie[0].dataset.media_type,
      'user_id' : this.dataset.user_id
    }
    console.log(data)
    postToQueue(data)
  })
}
removeFromQueueListener()

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

