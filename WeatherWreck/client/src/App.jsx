import AboutUs from './components/AboutUs.jsx';
import NavBar from './components/NavBar.jsx';
import './App.css';
import { useState, lazy, Suspense } from 'react';

//Lazy imports, allows the app to not have to install all of the views
const Footer = lazy(
  () => import('./components/Footer.jsx')
);
const AccidentMap = lazy(
  () => import('./components/AccidentMap.jsx')
);
const ChartsPage = lazy(
  () => import('./components/ChartsPage.jsx')
);

function App() {
  const [currentPage, setCurrentPage] = useState('AboutUs');

  // Function to render the selected component
  const renderPage = () => {
    switch (currentPage) {
    case 'AccidentMap':
      // Lazy-loaded AccidentMap
      return (
        <Suspense fallback={<div className="loading"><p>Loading Accident Map...</p></div>}>
          <AccidentMap />
        </Suspense>
      );
    case 'ChartsPage':
      // Lazy-loaded ChartsPage
      return (
        <Suspense fallback={<div className="loading"><p>Loading Charts...</p></div>}>
          <ChartsPage />
        </Suspense>
      );
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
      <Suspense fallback={<div className="loading"><p>Loading footer...</p></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
