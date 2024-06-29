import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card"; // Ensure correct import path

// ProfileView functional component
const ProfileView = ({ user, token, setUser }) => {
  // State hooks for user information
  const [username, setUsername] = useState(user.Username);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user.Email);
  const [birthdate, setBirthdate] = useState(user.Birthday.slice(0, 10));
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [movies, setMovies] = useState([]);

  // useEffect to fetch all movies and filter user's favorite movies
  useEffect(() => {
    // Fetch all movies
    fetch("https://movieverse-902fc605dee3.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
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
        // Set movies state and filter favorite movies
        setMovies(moviesFromApi);
        setFavoriteMovies(moviesFromApi.filter(m => user.FavoriteMovies.includes(m.id)));
      });
  }, [token, user.FavoriteMovies]);

  // Function to handle profile update
  const handleUpdate = (e) => {
    e.preventDefault();
    // API call to update user information
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
        // Update user state and localStorage
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        alert("Profile updated successfully");
      })
      .catch(e => {
        console.error("Error updating the profile:", e);
      });
  };

  // Function to handle user deregistration
  const handleDeregister = () => {
    // API call to delete user
    fetch(`https://movieverse-902fc605dee3.herokuapp.com/users/${user.Username}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert("User deregistered");
        setUser(null);
        localStorage.clear();
      })
      .catch(e => {
        console.error("Error deregistering the user:", e);
      });
  };

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
              <Button variant="danger" onClick={handleDeregister} className="ml-2">
                Deregister
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Body>
            <Card.Title>Favorite Movies</Card.Title>
            <Row>
              {favoriteMovies.map((movie) => (
                <Col key={movie.id} md={4} className="mb-3">
                  <MovieCard movie={movie} />
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

// PropTypes for ProfileView component to validate props
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
