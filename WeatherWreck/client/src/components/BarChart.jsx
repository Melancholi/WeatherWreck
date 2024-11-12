import Plot from 'react-plotly.js';

/**
 * Displays a bar chart visualizing the number of accidents based on 
 * different weather conditions.
 * The chart shows accident counts for each weather type using a bar 
 * chart with custom colors.
 * 
 * @component
 * @param {Object} events - An object where keys are weather conditions 
 * and values are arrays of accidents.
 * @param {string[]} validWeatherType - An array of valid weather conditions 
 * used to filter and display the accident data.
 */
export default function BarChart({ events, validWeatherType }) {
  // Array to store the number of accidents for each valid weather condition
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
      hovertemplate: 'During the %{x} Weather Condition\n' +
                     '%{y} Accidents Happened<extra></extra>',
      marker: {
        color: [
          '#49899D', // Cold
          '#24AFE9', // Fog
          '#A9A9A9',  // Hail
          '#496371',  // Precipitation
          '#73D1DC',  // Rain
          '#A7E9F4',  // Snow
          '#FE8418' // Storm
        ]
      },
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
