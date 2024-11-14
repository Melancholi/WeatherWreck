import ChartsPage from './components/ChartsPage.jsx';
import AccidentMap from './components/AccidentMap.jsx';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

function App() {
  /* 
    Learned how to do this from this youtube video 
    https://youtu.be/SLfhMt5OUPI?t=355&si=8nmXMeosxHSO2kUY
  */
  // let component = <AccidentMap />;
  // const mapView = document.getElementById('map');
  // const chartsView = document.getElementById('charts');
  // mapView.addEventListener('click', () => {
  //   component = <AccidentMap />;
  // });
  // chartsView.addEventListener('click', () => {
  //   component = <ChartsPage />;
  // });
  
  // mapView.addEventListener('click', () => {
  //   component = <AccidentMap />;
  // });
  // chartsView.addEventListener('click', () => {
  //   component = <ChartsPage />;
  // });

  // switch (window.location.pathname) {
  // case '/':
  //   component = <AccidentMap />;
  //   break;
  // case '/charts':
  //   component = <ChartsPage />;
  //   break;
  // default:
  //   component = <AccidentMap />;
  //   break;
  // }
  
  return (
    <div>
      <NavBar />
      {/* {component} */}
      <Footer />
    </div>
  );
}

export default App;
