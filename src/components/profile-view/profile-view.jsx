import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import './profile-view.scss'; // Import custom styles

const ProfileView = ({ user, token, setUser }) => {
  // State variables for user information and favorite movies
  const [username, setUsername] = useState(user.Username);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user.Email);
  const [birthdate, setBirthdate] = useState(user.Birthday.slice(0, 10));
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [movies, setMovies] = useState([]);

  // Effect to fetch movies from API and update favorite movies based on user data
  useEffect(() => {
    fetch("https://movieverse-902fc605dee3.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        // Map fetched data to extract relevant movie information
        const moviesFromApi = data.map((doc) => ({
          id: doc._id,
          title: doc.Title,
          director: doc.Director.Name,
          image: doc.ImagePath,
          genre: doc.Genre.Name,
          description: doc.Description,
        }));
        setMovies(moviesFromApi);

        // Filter favorite movies based on user's favorite list
        const userFavoriteMovies = moviesFromApi.filter((m) =>
          user.FavoriteMovies.includes(m.id)
        );
        setFavoriteMovies(userFavoriteMovies);
      })
      .catch((error) => console.error('Error fetching movies:', error));
  }, [token, user.FavoriteMovies]);

  // Handler for updating user profile information
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`https://movieverse-902fc605dee3.herokuapp.com/users/${user.Username}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthdate,
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Update user data in state and local storage
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        alert("Profile updated successfully");
      })
      .catch(e => {
        console.error("Error updating the profile:", e);
      });
  };

  // Handler for deregistering (deleting) user account
  const handleDeregister = () => {
    fetch(`https://movieverse-902fc605dee3.herokuapp.com/users/${user.Username}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        // Clear user data from local storage and reset state
        alert("User deregistered");
        setUser(null);
        localStorage.clear();
      })
      .catch(e => {
        console.error("Error deregistering the user:", e);
      });
  };

  // Handler for removing a favorite movie from user's favorites
  const handleRemoveFavorite = (movieId) => {
    fetch(`https://movieverse-902fc605dee3.herokuapp.com/users/${user._id}/favorites/${movieId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        // Update user data and favorite movies list after removal
        const updatedUser = {
          ...user,
          FavoriteMovies: user.FavoriteMovies.filter(id => id !== movieId),
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setFavoriteMovies(favoriteMovies.filter(movie => movie.id !== movieId));
      })
      .catch(e => {
        console.error("Error removing the favorite movie:", e);
      });
  };

  // Render user profile view with form for updating information and list of favorite movies
  return (
    <Row>
      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title>User Information</Card.Title>
            <Form onSubmit={handleUpdate}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBirthdate">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
              <Button variant="secondary" onClick={handleDeregister} className="ml-2">
                Delete Profile
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title>Favorite Movies</Card.Title>
            <ul className="favorite-movies-list">
              {favoriteMovies.map((movie) => (
                <li key={movie.id} className="favorite-movie-item">
                  <Link to={`/movies/${encodeURIComponent(movie.id)}`} className="favorite-movie-link">
                    {movie.title}
                  </Link>
                  <Button
                    variant="link"
                    className="remove-button"
                    onClick={() => handleRemoveFavorite(movie.id)}
                  >
                    &#10005;
                  </Button>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

// Define prop types for ProfileView component
ProfileView.propTypes = {
  user: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    FavoriteMovies: PropTypes.arrayOf(PropTypes.string).isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default ProfileView;
