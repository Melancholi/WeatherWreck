import ChartsPage from './components/ChartsPage.jsx';
import AccidentMap from './components/AccidentMap.jsx';
import AboutUs from './components/AboutUs.jsx';
import NavBar from './components/NavBar.jsx';
import './App.css';
import { useState, lazy, Suspense } from 'react';

const Footer = lazy(
  () => import('./components/Footer.jsx')
);

function App() {
  const [currentPage, setCurrentPage] = useState('AboutUs');

  // Function to render the selected component
  const renderPage = () => {
    switch (currentPage) {
    case 'AccidentMap':
      return <AccidentMap />;
    case 'ChartsPage':
      return <ChartsPage />;
    case 'AboutUs':
      return <AboutUs />;
    default:
      return <AboutUs />;
    }
  };

  return (
    <div>
      <NavBar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage} 
      />
      {renderPage()}
      {/* Lazy-loaded Footer */}
      <Suspense fallback={<div>Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
