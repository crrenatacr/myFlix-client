import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import "./movie-card.scss";

export const MovieCard = ({ movie }) => {
  // Load user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  // Initialize state for whether movie is favorited
  const [favorited, setFavorited] = useState(
    storedUser && storedUser.FavoriteMovies.includes(movie.id)
  );

  // Function that toggles movie favorite status
  const toggleFavorite = () => {
    const userId = storedUser._id;
    const endpoint = favorited
      ? `https://movieverse-902fc605dee3.herokuapp.com/users/${userId}/favorites/${movie.id}`
      : `https://movieverse-902fc605dee3.herokuapp.com/users/${userId}/favorites`;

    // Define request options based on current favorite status
    const requestOptions = {
      method: favorited ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: favorited ? {} : JSON.stringify({ movieId: movie.id }),
    };

    // Send request to server to add or remove favorite
    fetch(endpoint, requestOptions)
      .then((response) => {
        if (favorited && response.ok) {
          return response.json();
        } else {
          return response;
        }
        throw new Error("Failed to toggle favorite.");
      })
      .then(() => {
        // Update local storage and state with updated user data
        const updatedUser = {
          ...storedUser,
          FavoriteMovies: favorited
            ? storedUser.FavoriteMovies.filter((id) => id !== movie.id)
            : [...storedUser.FavoriteMovies, movie.id],
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setFavorited(!favorited); // Toggle the favorited state
      })
      .catch((error) => console.error("Error toggling favorite:", error));
  };

  // Effect to update favorited state based on changes in localStorage
  useEffect(() => {
    setFavorited(storedUser && storedUser.FavoriteMovies.includes(movie.id));
  }, [storedUser, movie.id]);

  return (
    <Card className="h-100 movie-card">
      <Card.Img variant="top" src={movie.image} className="card-img-top" />

      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.description}</Card.Text>
        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button variant="purple" className="open-button">
            Open
          </Button>
        </Link>
      </Card.Body>

      {/* Favorite button with conditional icon based on favorited state */}
      <Button
        variant="link"
        className="favorite-button"
        onClick={toggleFavorite}
      >
        {favorited ? (
          <BsHeartFill className="heart-icon filled" />
        ) : (
          <BsHeart className="heart-icon outline" />
        )}
      </Button>
    </Card>
  );
};

// Prop types for MovieCard component
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default MovieCard;
