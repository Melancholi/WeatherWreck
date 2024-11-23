import favicon from '../../public/favicon.ico';
import './NavBar.css';
export default function NavBar({ setCurrentPage }) {
  return (
    <header>
      <div id="appTitle">
        <img src={favicon} alt="App Logo" id="logo" />
        <h1>WeatherWreck</h1>
      </div>

      <div id="navBar">
        <nav>
          <ul id="navUl">
            {/* Use onClick to switch pages */}
            <li className="nav-link" onClick={() => setCurrentPage('AboutUs')}>
              About Us
            </li>
            <li className="nav-link" onClick={() => setCurrentPage('AccidentMap')}>
              View Accidents Map
            </li>
            <li className="nav-link" onClick={() => setCurrentPage('ChartsPage')}>
              View Charts
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
