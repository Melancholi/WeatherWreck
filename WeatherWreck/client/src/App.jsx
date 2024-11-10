<<<<<<< HEAD
import ChartsPage from './components/ChartsPage.jsx';
import AccidentMap from './components/AccidentMap.jsx';
import NavBar from './components/NavBar.jsx';
=======
import FetchData from './components/fetchData.jsx';
import Header from './components/Header.jsx';
>>>>>>> d6d981c (Add basic header and footer)
import Footer from './components/Footer.jsx';
import './App.css';

function App() {
  /* 
    Learned how to do this from this youtube video 
    https://youtu.be/SLfhMt5OUPI?t=355&si=8nmXMeosxHSO2kUY
  */
  let component;
  switch (window.location.pathname) {
  case '/':
    component = <AccidentMap />;
    break;
  case '/charts':
    component = <ChartsPage />;
    break;
  default:
    component = <AccidentMap />;
    break;
  }
  return (
    <div>
<<<<<<< HEAD
      <NavBar />
      {component}
=======
      <Header />
      <FetchData/>
>>>>>>> d6d981c (Add basic header and footer)
      <Footer />
    </div>
  );
}

export default App;
