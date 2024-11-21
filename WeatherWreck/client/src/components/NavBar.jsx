
export default function NavBar() {
  return (
    <header>
      <div id="appTitle">
        <img src="../../public/favicon.ico" alt="App Logo" id="logo"/>
        <h1> WeatherWreck</h1>
      </div>

      <div id="navBar">
        <nav>
          <ul id="navUl">
            <a href="/" className="nav-link">View Accidents</a>
            <a href="/charts" className="nav-link">View Charts</a>
          </ul>
        </nav>
      </div>
    </header>
  );
}