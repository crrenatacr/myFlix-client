import React, { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import MovieView from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './main-view.scss';

// Functional component MainView
export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem('user')); // Retrieve user from localStorage
  const storedToken = localStorage.getItem('token'); // Retrieve token from localStorage
  const [user, setUser] = useState(storedUser ? storedUser : null); // Initialize user state with stored value or null
  const [token, setToken] = useState(storedToken ? storedToken : null); // Initialize token state with stored value or null
  const [movies, setMovies] = useState([]); // State to store movies fetched from API
  const [selectedMovie, setSelectedMovie] = useState(null); // State to manage the selected movie for detailed view
  const [loading, setLoading] = useState(true); // State to manage loading status

  // Fetch movies when the user logs in and the token is available
  useEffect(() => {
    if (!token) {
      setLoading(false); // If there's no token, set loading to false to show login/signup forms
      return; // Exit if there is no token
    }

    fetch('https://movieverse-902fc605dee3.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }, // Use the token for authorization
    })
      .then((response) => response.json())
      .then((data) => {
        // Map API data to movie objects with required fields
        const moviesFromApi = data.map((doc) => ({
          id: doc._id,
          title: doc.Title,
          director: doc.Director.Name,
          image: doc.ImagePath,
          genre: doc.Genre.Name,
          description: doc.Description,
        }));

        setMovies(moviesFromApi); // Update the movies state with data from the API
        setLoading(false); // Once movies are fetched, set loading to false
      });
  }, [token]); // Re-fetch movies whenever the token changes

  // Function to handle logout
  const handleLogout = () => {
    setUser(null); // Clear the user state on logout
    setToken(null); // Nullify the token on logout
    localStorage.clear(); // Clear localStorage
  };

  // If app is still loading, show a loading message or spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, show login and signup forms
  if (!user) {
    return (
      <Row>
        <Col className="text-center mb-3">
          <h2>Welcome</h2>
          <p>Please log in or sign up to continue.</p>
        </Col>
        <Col className="text-center mb-3">
          <LoginView
            onLoggedIn={(user, token) => {
              setUser(user); // Set the user state
              setToken(token); // Set the token state
            }}
          />
        </Col>
        <Col className="text-center mb-3">
          <span>or</span>
          <SignupView />
        </Col>
      </Row>
    );
  }

  // Render MovieView for detailed movie display if selectedMovie is not null
  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)} // Handle back button click to unset selectedMovie
        similarMovies={movies.filter((m) => m.id !== selectedMovie.id)} // Filter movies to exclude selectedMovie as similar
      />
    );
  }

  // If there are no movies fetched, display a message
  if (movies.length === 0) {
    return <div className="text-center">The list is empty!</div>;
  }

  // Default case: render movie cards for each movie in the movies array
  return (
    <div className="movie-cards">
      <Row xs={1} md={2} lg={4} className="g-4">
        {movies.map((movie) => (
          <Col className="mb-5" key={movie.id} md={3}>
            <MovieCard
              movie={movie}
              onMovieClick={(newSelectedMovie) => setSelectedMovie(newSelectedMovie)} // Set selectedMovie state on movie card click
            />
          </Col>
        ))}
      </Row>
      {/* Logout button */}
      <Button variant="secondary" onClick={handleLogout} className="logout-button">
        Logout
      </Button>
    </div>
  );
};
