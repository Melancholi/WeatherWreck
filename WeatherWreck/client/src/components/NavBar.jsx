import favicon from './../assets/favicon.ico';
import './NavBar.css';

export default function NavBar({ currentPage, setCurrentPage }) {
  return (
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
