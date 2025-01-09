import favicon from './../assets/favicon.ico';
import './NavBar.css';

/**
 * NavBar Component
 * 
 * Renders the application's navigation bar with links to different pages. The component
 * highlights the active page and allows users to switch between "About Us," "Accident Map,"
 * and "Charts Page."
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.currentPage - The current active page.
 * @param {function} props.setCurrentPage - Function to update the current page state.
 * @returns {JSX.Element} The navigation bar component.
 */
export default function NavBar({ currentPage, setCurrentPage }) {
  return (
    /**
     * Main header element containing the app title and navigation bar.
     */
    <header>
      <div id="appTitle">
        <img src={favicon} alt="App Logo" id="logo" />
        <h1>WeatherWreck</h1>
      </div>

      <div id="navBar">
        <nav>
          <ul id="navUl">
            <li
              className={`nav-link ${currentPage === 'AboutUs' ? 'active' : ''}`}
              onClick={() => setCurrentPage('AboutUs')}
            >
              About Us
            </li>
            <li
              className={`nav-link ${
                currentPage === 'AccidentMap' ? 'active' : ''
              }`}
              onClick={() => setCurrentPage('AccidentMap')}
            >
              View Accidents Map
            </li>
            <li
              className={`nav-link ${
                currentPage === 'ChartsPage' ? 'active' : ''
              }`}
              onClick={() => setCurrentPage('ChartsPage')}
            >
              View Charts
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
