import ChartsPage from './ChartsPage.jsx';
import AccidentMap from './AccidentMap.jsx';

function Foo() {
  document.getElementById("map").onclick = AccidentMap;
}

function Boo() {
  document.getElementById("charts").onclick = ChartsPage;
}
export default function NavBar() {
  let component = <AccidentMap />;
  const mapView = document.getElementById('#map');
  const chartsView = document.getElementById('#charts');
  // mapView.addEventListener('click', () => {
  //   component = <AccidentMap />;
  // });
  // chartsView.addEventListener('click', () => {
  //   component = <ChartsPage />;
  // });
  function Foo() {
    mapView.onclick = AccidentMap;
    component = <AccidentMap />;
  }
  
  function Boo() {
    chartsView.onclick = ChartsPage;
    component = <ChartsPage />;
  }
  return (
    <>
      <header>
        <div id="appTitle">
          <img src="../../public/favicon.ico" alt="App Logo" id="logo"/>
          <h1> WeatherWreck</h1>
        </div>

        <div id="navBar">
          <nav>
            <ul id="navUl">
              {/* <a className="nav-link" id="map">View Accidents</a> */}
              <button id="map" onclick={Foo}>View Accidents</button>
              {/* <a className="nav-link" id="charts">View Charts</a> */}
              <button id="charts" onclick={Boo}>View Charts</button>
            </ul>
          </nav>
        </div>
      </header>
      {component}
    </>
  );
}