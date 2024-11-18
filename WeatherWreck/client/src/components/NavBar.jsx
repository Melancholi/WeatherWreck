import ChartsPage from './ChartsPage.jsx';
import AccidentMap from './AccidentMap.jsx';

export default function NavBar({ setCurrentPage }) {
  return (
    <header>
      <div id="appTitle">
        <img src="../../public/favicon.ico" alt="App Logo" id="logo" />
        <h1>WeatherWreck</h1>
      </div>

      <div id="navBar">
        <nav>
          <ul id="navUl">
            {/* Use onClick to switch pages */}
            <li className="nav-link" onClick={() => setCurrentPage('AccidentMap')}>
              View Accidents
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
