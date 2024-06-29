import React from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import { MovieCard } from '../movie-card/movie-card';
import './movie-view.scss';

// MovieView functional component
export const MovieView = ({ movies }) => {
const MovieView = ({ movies }) => {
  // Accessing the movieId from URL parameters
  const { movieId } = useParams();

  // Finding the movie with the matching ID
  const movie = movies.find((m) => m.id === movieId);

  return (
    <div className="movie-view">
      {/* Displaying the movie image */}
      <div>
        <img src={movie.image} alt={movie.title} style={{ width: '100%' }} />
      </div>
      {/* Displaying the movie title */}
      <div>
        <span>Title: </span>
        <span>{movie.title}</span>
      </div>
      {/* Displaying the movie director */}
      <div>
        <span>Director: </span>
        <span>{movie.director}</span>
      </div>
      {/* Displaying the movie genre */}
      <div>
        <span>Genre: </span>
        <span>{movie.genre}</span>
      </div>
      {/* Displaying the movie description */}
      <div>
        <span>Description: </span>
        <span>{movie.description}</span>
      </div>
      {/* Link to go back to the movie list */}
      <Link to="/">
        <button className="back-button" style={{ cursor: "pointer" }}>
          Back
        </button>
      </Link>

      {/* Section for similar movies */}
      <hr />
      <h2>Similar Movies</h2>
      {/* Mapping through similarMovies array to display MovieCard for each */}
      {movie.similarMovies.map((similarMovie) => (
        <MovieCard key={similarMovie.id} movie={similarMovie} onMovieClick={() => {}} />
      ))}
    </div>
  );
};
};

// PropTypes for MovieView component to validate props
MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      director: PropTypes.string.isRequired,
      genre: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      similarMovies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          image: PropTypes.string.isRequired,
          director: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default MovieView; // Exporting MovieView as default component