import { useEffect, useState, lazy, Suspense } from 'react';
import bobLoadingImage from '../assets/bob.webp';
import BarChart from './BarChart.jsx';
import './ChartsPage.css';

//Lazy imports, allows the app to not have to install all of the views
const PieChart = lazy(
  () => import('./PieChart.jsx')
);
/**
 * List of valid weather conditions for filtering accident data.
 * @constant {string[]}
 */
const validWeatherType = [
  'Cold', 'Fog', 'Precipitation',
  'Rain', 'Snow', 'Storm'
];

/**
 * Object used to store accidents categorized by weather condition.
 * @type {Object.<string, Object[]>}
 */
function Loading() {
  return (
    <div className="loading-container-charts"> 
      <img src={bobLoadingImage} alt="Please wait" className="loading-image-charts" />
      <p>I know, I know... Wait patiently... It&apos;s loading ...</p>
    </div>);
}

/**
 * The main component that displays charts for accidents based on weather conditions.
 * It fetches accident data, categorizes it based on weather condition, and displays
 * either a Bar Chart or Pie Chart based on user selection.
 */
export default function ChartsPage({ apiVersion = 'v2' }) {
  // State to store the categorized accident data
  const [acc, setAcc] = useState([]);
  // State to track the loading status of the data
  const [loading, setLoading] = useState(true);
  /**
   * useEffect hook that fetches accident data from the API and categorizes it
   * based on weather condition. It sets the categorized data into state once fetched.
   */
  useEffect(() => {
    const data = async () => {
      try {
        setLoading(true);

        const aggregatedAccidents = {
          Cold: [],
          Fog: [],
          Precipitation: [],
          Rain: [],
          Snow: [],
          Storm: []
        };

        if (apiVersion === 'v2') {
          const pageSize = 100;
          let hasMore = true;
          let cursor = null;

          while (hasMore) {
            const cursorParam = cursor ? `&cursor=${cursor}` : '';
            const response = await fetch(`/api/v2/accidents?limit=${pageSize}${cursorParam}`);
            if (!response.ok) {
              if (response.status === 404) {
                break;
              }
              throw new Error(`Request failed with status ${response.status}`);
            }

            const result = await response.json();
            const pageData = Array.isArray(result.data) ? result.data : [];

            // Loop through each page and categorize by weather condition.
            pageData.forEach((accident) => {
              const weatherCondition = accident.WeatherCondition;

              if (validWeatherType.includes(weatherCondition)) {
                aggregatedAccidents[weatherCondition].push(accident);
              }
            });

            hasMore = Boolean(result.pagination?.hasMore);
            cursor = result.pagination?.nextCursor;
          }
        } else {
          const response = await fetch('/api/v1/accidents');
          if (!response.ok) {
            if (response.status === 404) {
              setAcc(aggregatedAccidents);
              return;
            }
            throw new Error(`Request failed with status ${response.status}`);
          }

          const result = await response.json();
          const records = Array.isArray(result) ? result : [];

          records.forEach((accident) => {
            const weatherCondition = accident.WeatherCondition;

            if (validWeatherType.includes(weatherCondition)) {
              aggregatedAccidents[weatherCondition].push(accident);
            }
          });
        }

        setAcc(aggregatedAccidents);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    data();
  }, [apiVersion]);

  // State to track the selected chart view (Bar or Pie).
  const [checked, setChecked] = useState('bar');
  /**
   * Function that handles the chart type change (Bar or Pie).
   * @function
   * @param {string} mode - The selected chart type ('bar' or 'pie').
   */
  function handleCheckedMode(mode) {
    setChecked(mode);
  }

  return (
    <div id="chartComponent">
      <section id="dataPanel">
        <div>
          <input 
            type="checkbox"
            id="barChart"
            value="bar"
            checked={checked === 'bar'}
            onChange={() => handleCheckedMode('bar')}/>
          <label>View Bar Chart</label>
        </div>
            
        <div>
          <input 
            type="checkbox"
            id="pieChart"
            value="pie"
            checked={checked === 'pie'}
            onChange={() => handleCheckedMode('pie')}/>
          <label>View Pie Chart</label>
        </div>    
      </section>

      {loading ? 
        <Loading />
        : 
        <section id="dataCharts">
          {checked === 'bar' &&
            <BarChart 
              events={acc}
              validWeatherType={validWeatherType}
            />
          }

          {checked === 'pie' && 
            // Lazy loading the PieChart 
            <Suspense fallback={<div className="loading"><p>Loading Pie Chart...</p></div>}>
              <PieChart weatherOfAccidents={acc} />
            </Suspense>
          }
        </section>
      }
    </div>
  );
}