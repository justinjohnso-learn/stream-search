console.log('JS working!')

function getMovieData(movieName){
  $.post('/movies/' + movieName, {movieName}, function(data) {
    console.log(data)
    appendMovieList(data)
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
    getOneMovie(movieId)
  })
}

var appendMovieList = function(movieList){
  var $title, $release_year, $rating, $rottentomatoes, $poster;
  $('body').append('<div class="movieContainer" />');
  $('.movieContainer').append('<div class="row"></div>');

  console.log($('#movieForm input').val()),
  console.log(movieList.searchQuery)

  if ($('#movieForm input').val() === movieList.searchQuery){
    movieList.movies.forEach(function(movie){
      if ($('.movieContainer .row:last-child div').length === 3 ){
          $('.movieContainer').append('<div class="row"></div>')
        }
      var $movie = $('<div />').addClass('movie')
                               .addClass('large-4 columns')
                               .attr('data-movie_id', movie.id);
      $title = $('<span />').addClass('title')
                            .text(movie.title);
      $release_year = $('<span />').addClass('release_year')
                            .text(movie.release_year);
      $rating = $('<span />').addClass('rating')
                            .text(movie.rating);
      $rottentomatoes = $('<span />').addClass('rottentomatoes')
                            .text(movie.rottentomatoes);
      $poster = $('<img />').addClass('poster')
                            .attr('src', movie.poster);
      $('.movieContainer .row:last-child').append($movie)
      $movie.append($title, $release_year, $rating, $rottentomatoes, $poster)
    });
  }
  movieClickListener()
}

var getOneMovie = function(movieId){
  console.log('id', movieId);
  $.post('/movieSearch/' + movieId, {movieId}, function(data) {
    console.log(data);
  });
}
