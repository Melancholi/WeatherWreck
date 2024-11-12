import { useEffect, useState } from 'react';
import BarChart from './BarChart.jsx';
import PieChart from './PieChart.jsx';

const validWeatherType = [
  'Cold', 'Fog', 'Hail', 'Precipitation',
  'Rain', 'Snow', 'Storm'
];

const accidents = {
  'Cold': [],
  'Fog': [],
  'Hail': [],
  'Precipitation': [],
  'Rain': [],
  'Snow': [],
  'Storm': []
};

export default function ChartsPage() {
  const [acc, setAcc] = useState([]);
  const [loading, setLoading] = useState(true);
  // Tracking whether data has been fetched or not
  const [isFetched, setIsFetched] = useState(false);

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

  const [checked, setChecked] = useState('bar');
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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>{acc.length} items fetched</p>
      )}

      <section id="dataCharts">
        {checked === 'bar' &&
            <BarChart />
        }
        {checked === 'pie' &&
            <PieChart weatherOfAccidents={acc} />
        }
      </section>
    </div>
  );
}