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
  let component
  switch (window.location.pathname) {
    case '/':
      component = <AccidentMap />
      break
    case '/charts':
      component = <ChartsPage />
      break
  }
  return (
    <div>
      <NavBar />
      {component}
      <Footer />
    </div>
  );
}

export default App;
