import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './signup-view.scss';

export const SignupView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate birthday format (mm.dd.yyyy)
    const birthdayPattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    if (!birthdayPattern.test(birthday)) {
      alert('Please enter a valid birthday in format mm.dd.yyyy');
      return;
    }

    // Send the user data to the server for registration
    fetch('https://movieverse-902fc605dee3.herokuapp.com/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('User registered:', data);
        onLoggedIn(data.token); // Trigger the login callback with the received token
      })
      .catch((error) => {
        console.error('Error registering user:', error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="3" 
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBirthday">
        <Form.Label>Birthday (mm.dd.yyyy):</Form.Label>
        <Form.Control
          type="text"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          placeholder="mm.dd.yyyy"
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Sign Up
      </Button>
    </Form>
  );
};

// PropTypes for SignupView component
SignupView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};