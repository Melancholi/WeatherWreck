import { useEffect, useState } from 'react';
import BarChart from './BarChart.jsx';
import PieChart from './PieChart.jsx';

/**
 * List of valid weather conditions for filtering accident data.
 * @constant {string[]}
 */
const validWeatherType = [
  'Cold', 'Fog', 'Hail', 'Precipitation',
  'Rain', 'Snow', 'Storm'
];

/**
 * Object used to store accidents categorized by weather condition.
 * @type {Object.<string, Object[]>}
 */
const accidents = {
  'Cold': [],
  'Fog': [],
  'Hail': [],
  'Precipitation': [],
  'Rain': [],
  'Snow': [],
  'Storm': []
};

/**
 * The main component that displays charts for accidents based on weather conditions.
 * It fetches accident data, categorizes it based on weather condition, and displays
 * either a Bar Chart or Pie Chart based on user selection.
 */
export default function ChartsPage() {
  // State to store the categorized accident data
  const [acc, setAcc] = useState([]);
  // State to track the loading status of the data
  const [loading, setLoading] = useState(true);
  // State to track whether the data has been fetched
  const [isFetched, setIsFetched] = useState(false);

  /**
   * useEffect hook that fetches accident data from the API and categorizes it
   * based on weather condition. It sets the categorized data into state once fetched.
   */
  useEffect(() => {
    // Only fetching data if it hasn't been fetched already
    const data = async () => {
      try {
        const response = await fetch('/api/accidents/matched');
        const result = await response.json();

        // Looping through the fetched data and categorize accidents based on Weather_Condition
        result.forEach(accident => {
          const weatherCondition = accident.Weather_Condition;

          // Checking if the weather condition is valid
          if (validWeatherType.includes(weatherCondition)) {
            accidents[weatherCondition].push(accident);
          }
        });

        setAcc(accidents);
        // Flagging that data has been fetched
        setIsFetched(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Checking if the data has already been fetched
    if (!isFetched) {
      data();
    } else {
      setLoading(false);
    }
  }, [isFetched]);

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
        <p>Loading...</p>
        : 
        <p>{acc.length} items fetched</p>
      }

      <section id="dataCharts">
        {checked === 'bar' &&
          <BarChart 
            events={acc}
            validWeatherType={validWeatherType}
          />
        }

        {checked === 'pie' &&
          <PieChart />
        }
      </section>
    </div>
  );
}