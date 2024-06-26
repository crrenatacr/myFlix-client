index.jsx 


import { createRoot } from 'react-dom/client';
import { MainView } from './components/main-view/main-view';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './index.scss'; // Imports custom stylesheet

const App = () => {
  return (
    <div>
      {/* Navbar for navigation */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">MovieVerse</Navbar.Brand> {/* Branding link */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Toggle button for mobile view */}
          
        </Container>
      </Navbar>

      {/* Main content area wrapped in Container with purple border */}
      <Container className="main-container">
        <MainView />
      </Container>

      {/* Footer section */}
      <footer className="footer">
        <Container>
          <p>&copy; {new Date().getFullYear()} MovieVerse. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

// Render the root component using React's createRoot method
const container = document.querySelector('#root');
const root = createRoot(container);
root.render(<App />);