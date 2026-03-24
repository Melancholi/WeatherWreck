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

/**
 * App Component
 * 
 * The root component of the application. It manages the navigation between pages
 * and lazy-loads components for improved performance. It also displays the footer
 * as a common element across pages.
 * 
 * @component
 * @returns {JSX.Element} The App component.
 */
function App() {
  const [currentPage, setCurrentPage] = useState('AboutUs');
  const [apiVersion, setApiVersion] = useState('v2');

  // Function to render the selected component
  const renderPage = () => {
    switch (currentPage) {
    case 'AccidentMap':
      // Lazy-loaded AccidentMap
      return (
        <Suspense fallback={<div className="loading"><p>Loading Accident Map...</p></div>}>
          <AccidentMap apiVersion={apiVersion} />
        </Suspense>
      );
    case 'ChartsPage':
      // Lazy-loaded ChartsPage
      return (
        <Suspense fallback={<div className="loading"><p>Loading Charts...</p></div>}>
          <ChartsPage apiVersion={apiVersion} />
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
      <section className="api-version-switch">
        <span className="api-version-label">API Version:</span>
        <button
          type="button"
          className={apiVersion === 'v1' ? 'api-version-btn active' : 'api-version-btn'}
          onClick={() => setApiVersion('v1')}
        >
          V1
        </button>
        <button
          type="button"
          className={apiVersion === 'v2' ? 'api-version-btn active' : 'api-version-btn'}
          onClick={() => setApiVersion('v2')}
        >
          V2
        </button>
      </section>
      {renderPage()}
      {/* Lazy-loaded Footer */}
      <Suspense fallback={<div className="loading"><p>Loading footer...</p></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
