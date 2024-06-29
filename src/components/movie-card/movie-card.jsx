import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./movie-card.scss";

// MovieCard functional component
export const MovieCard = ({ movie }) => {
  return (
    <Card className="h-100">
      {/* Display movie image */}
      <Card.Img variant="top" src={movie.image} />
      <Card.Body>
        {/* Display movie title */}
        <Card.Title>{movie.title}</Card.Title>
        {/* Display movie description */}
        <Card.Text>{movie.description}</Card.Text>
        {/* Link to MovieView with dynamic movieId parameter */}
        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button variant="link">Open</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

// PropTypes for MovieCard component to validate props
MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};
