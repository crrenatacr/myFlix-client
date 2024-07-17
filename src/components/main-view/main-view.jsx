import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationBar } from "../navigation-bar/navigation-bar"; 
import ProfileView from "../profile-view/profile-view"; 
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./main-view.scss";

// Functional component MainView
export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
  const storedToken = localStorage.getItem("token"); // Retrieve token from localStorage
  const [user, setUser] = useState(storedUser ? storedUser : null); // Initialize user state with stored value or null
  const [token, setToken] = useState(storedToken ? storedToken : null); // Initialize token state with stored value or null
  const [movies, setMovies] = useState([]); // State to store movies fetched from API
  const [loading, setLoading] = useState(true); // State to manage loading status

  // Fetch movies when the user logs in and the token is available
  useEffect(() => {
    if (!token) {
      setLoading(false); // If there's no token, set loading to false to show login/signup forms
      return; // Exit if there is no token
    }

    fetch("https://movieverse-902fc605dee3.herokuapp.com/movies", {
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

  return (
    <BrowserRouter>
      {/* NavigationBar component for navigation */}
      <NavigationBar user={user} onLoggedOut={handleLogout} />

      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/register"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView
                      onLoggedIn={(user, token) => {
                        setUser(user); // Set the user state
                        setToken(token); // Set the token state
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <Col md={8}>
                    <MovieView movies={movies} />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Col md={8}>
                    <ProfileView user={user} token={token} setUser={setUser} />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <>
                    <Row xs={1} md={2} lg={4} className="g-4">
                      {movies.map((movie) => (
                        <Col className="mb-5" key={movie.id} md={3}>
                          <MovieCard movie={movie} />
                        </Col>
                      ))}
                    </Row>
                    
                  </>
                )}
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
