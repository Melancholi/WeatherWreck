import Plot from 'react-plotly.js';
const validWeatherType = [
  'Cold', 'Fog', 'Hail', 'Precipitation',
  'Rain', 'Snow', 'Storm'
];

/**
 * Displays accident percentages based on weather condition.
 */
export default function BarChart() {
  const [acc, setAcc] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect (() => {
    const d = async () => {
      try {
        const response = await fetch('/api/accidents/matched'); 
        const result = await response.json();
        setAcc(result);
        //acc.push(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    // Call the fetch function when component mounts
    d();
  }, []);

  /*
    Example from https://plotly.com/javascript/bar-charts/
    I used the example for the "Basic Bar Chart"
  */
  const data = [
    {
      x: validWeatherType,
      y: [20, 14, 23, 12, 30, 24, 13],
      type: 'bar'
    }
  ];

  var layout = {
    height: 500,
    width: 500,
    title: 'Test Bar Chart'
  };

  return( 
    <div>
      <h1>Temporary BarChart Display</h1>
      <Plot
        data={data}
        layout={layout}
      />
    </div>
  );
}
