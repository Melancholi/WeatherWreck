import {useState} from 'react';
import BarChart from './BarChart.jsx';
import PieChart from './PieChart.jsx';

export default function ChartsPage() {
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