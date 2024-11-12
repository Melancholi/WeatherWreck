import Plot from 'react-plotly.js';

/**
 * Displays accident percentages based on weather condition.
 */
export default function BarChart({ events, validWeatherType }) {
  const weatherCounts = [];

  // Getting the amount of accidents that happended for each weather condition
  for (let i = 0; i < validWeatherType.length; i++) {
    const weatherType = validWeatherType[i];

    if (events[weatherType]) {
      weatherCounts.push(events[weatherType].length);
    } else {
      weatherCounts.push(0);
    }
  }

  /*
    Example from https://plotly.com/javascript/bar-charts/
    I mostly used the example for the "Basic Bar Chart"
  */
  const data = [
    {
      x: validWeatherType,
      y: weatherCounts,
      type: 'bar'
    }
  ];

  var layout = {
    height: 800,
    width: 800,
    title: 'Accident Percentages Based On Weather Condition',
    yaxis: {
      title: {
        text: 'Number of Accidents'
      }
    },
    xaxis: {
      title: {
        text: 'Weather Condition'
      }
    }
  };

  return( 
    <div>
      <Plot
        data={data}
        layout={layout}
      />
    </div>
  );
}
