// Importações necessárias do React e React-Bootstrap
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

// Função do componente NavigationBar
export const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* Branding link */}
        <Navbar.Brand href="#">MovieVerse</Navbar.Brand>
        {/* Toggle button for mobile view */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* Navigation links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/profile">Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
