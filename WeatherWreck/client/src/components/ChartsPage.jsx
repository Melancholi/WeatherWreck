import { useEffect, useState } from 'react';
import BarChart from './BarChart.jsx';
import PieChart from './PieChart.jsx';

const validWeatherType = [
  'Cold', 'Fog', 'Hail', 'Precipitation',
  'Rain', 'Snow', 'Storm'
];

// const accidents = {
//   'Cold': [],
//   'Fog': [],
//   'Hail': [],
//   'Precipitation': [],
//   'Rain': [],
//   'Snow': [],
//   'Storm': []
// };

export default function ChartsPage() {
  const [acc, setAcc] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect (() => {
    const data = async () => {
      try {
        const response = await fetch('/api/accidents/matched'); 
        const result = await response.json();
        setAcc(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    data();
  }, []);
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
        <>
          <p>Loading...</p>
        </>
      ): (
        <>
          <p></p>
        </>
      )}
      <section id="dataCharts">
        {checked === 'bar' &&
            <BarChart />
          }

          
          {checked === 'pie' &&
            <PieChart />
          }
      </section>
    </div>
  );
}