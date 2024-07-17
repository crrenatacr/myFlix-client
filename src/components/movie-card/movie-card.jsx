import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsHeart, BsHeartFill } from 'react-icons/bs'; // Importing empty and filled heart icons

import "./movie-card.scss";

// Functional component MovieCard
export const MovieCard = ({ movie }) => {
  // Retrieve user and token from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
  const storedToken = localStorage.getItem("token"); // Retrieve token from localStorage

  // State to control movie favorite status
  const [favorited, setFavorited] = useState(
    storedUser.FavoriteMovies.includes(movie.id)
  ); // State to control movie favorite status

  // Function to toggle movie favorite status
  const toggleFavorite = () => {
    if (!favorited) {
      // If movie is not a favorite, add it to the user's favorites
      fetch(`https://movieverse-902fc605dee3.herokuapp.com/users/${storedUser._id}/favorites`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        body: JSON.stringify({ movieId: movie.id }),
        method: "POST",
      }).then(() => {
        // Update local storage and state after successful addition
        storedUser.FavoriteMovies.push(movie.id);
        localStorage.setItem("user", JSON.stringify(storedUser));
        setFavorited(true);
      });
    } else {
      // If movie is already a favorite, remove it from the user's favorites
      fetch(`https://movieverse-902fc605dee3.herokuapp.com/users/${storedUser._id}/favorites/${movie.id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        method: "DELETE",
      }).then(() => {
        // Update local storage and state after successful removal
        storedUser.FavoriteMovies = storedUser.FavoriteMovies.filter(
          (id) => id !== movie.id
        );
        localStorage.setItem("user", JSON.stringify(storedUser));
        setFavorited(false);
      });
    }
  };

  return (
    <Card className="h-100 movie-card">
      {/* Movie image */}
      <Card.Img variant="top" src={movie.image} className="card-img-top" />

      <Card.Body>
        {/* Movie title */}
        <Card.Title>{movie.title}</Card.Title>

        {/* Movie description */}
        <Card.Text>{movie.description}</Card.Text>

        {/* Button to open movie view */}
        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button variant="purple" className="open-button">Open</Button>
        </Link>
      </Card.Body>

      {/* Favorite button */}
      <Button variant="link" className="favorite-button" onClick={toggleFavorite}>
        {favorited ? <BsHeartFill className="heart-icon filled" /> : <BsHeart className="heart-icon outline" />}
      </Button>
    </Card>
  );
};

// PropTypes to validate MovieCard props
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired, // Added id prop type
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default MovieCard; // Exporting MovieCard component as default
