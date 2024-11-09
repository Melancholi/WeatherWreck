
export default function NavBar() {
  return (
    <header>
      <div>
        <h1> WeatherWreck</h1>
      </div>

      <div id="navBar">
        <nav>
          <ul id="navUl">
            {/* TO DO: Make the the folowing clickable and functional */}
            <li>View Accidents</li>
            <li>View Charts</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}