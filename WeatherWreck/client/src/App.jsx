import ChartsPage from './components/ChartsPage.jsx';
import AccidentMap from './components/AccidentMap.jsx';
import AboutUs from './components/AboutUs.jsx';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import './App.css';
import { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('AccidentMap');

  // Function to render the selected component
  const renderPage = () => {
    switch (currentPage) {
    case 'AccidentMap':
      return <AccidentMap />;
    case 'ChartsPage':
      return <ChartsPage />;
    default:
      return <AboutUs />;
    }
  };

  return (
    <div>
      <NavBar setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;
