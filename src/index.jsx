import { createRoot } from 'react-dom/client';
import { MainView } from './components/main-view/main-view';
import Container from 'react-bootstrap/Container';
import { NavigationBar } from './components/navigation-bar/navigation-bar'; // Imports the new component NavigationBar

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'; // Imports custom stylesheet

const App = () => {
  return (
    <div>
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
