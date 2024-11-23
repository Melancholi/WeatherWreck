import { useState } from 'react';
import favicon from './../assets/favicon.ico';
import './NavBar.css';

export default function NavBar({ setCurrentPage }) {
  // Tracking the current active page
  const [activePage, setActivePage] = useState('AboutUs');

  // Handling navigation clicks
  const handleNavClick = (page) => {
    // Setting the active page
    setActivePage(page);
    // Setting the current page
    setCurrentPage(page);
  };

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
              className={`nav-link ${activePage === 'AboutUs' ? 'active' : ''}`}
              onClick={() => handleNavClick('AboutUs')}
            >
              About Us
            </li>
            <li
              className={`nav-link ${
                activePage === 'AccidentMap' ? 'active' : ''
              }`}
              onClick={() => handleNavClick('AccidentMap')}
            >
              View Accidents Map
            </li>
            <li
              className={`nav-link ${
                activePage === 'ChartsPage' ? 'active' : ''
              }`}
              onClick={() => handleNavClick('ChartsPage')}
            >
              View Charts
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
