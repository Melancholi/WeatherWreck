import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

/**
 * Function to dynamically get the chart size based on the screen width
 */ 
const getChartSize = () => {
  let width; 
  let height;

  /* Adjusts the size of the chart based on screen width 
    (for smaller, medium, large screens)
    Learned about innerHeight property from here
    https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight
    Learned about innerWidth property from here
    https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
  */
  if (window.innerWidth < 600) {  
    width = window.innerWidth - 20;
    height = 300;
  } else if (window.innerWidth >= 600 && window.innerWidth < 1200) {
    width = window.innerWidth - 50;
    height = 400;
  } else {
    width = 800;
    height = 500;
  }

  return { width, height };
};

/**
 * Displays a bar chart visualizing the number of accidents based on 
 * different weather conditions.
 * 
 * @component
 * @param {Object} events - An object where keys are weather conditions 
 * and values are arrays of accidents.
 * @param {string[]} validWeatherType - An array of valid weather conditions 
 * used to filter and display the accident data.
 */
export default function BarChart({ events, validWeatherType }) {
  // State to store the width and height for the chart
  const [chartSize, setChartSize] = useState(getChartSize());

  // Handling the chart size on window resize
  const handleResize = () => {
    setChartSize(getChartSize());
  };

  // Update chart size on window resize
  useEffect(() => {
    /* Used an example from here
      https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
    */ 
    window.addEventListener('resize', handleResize);

    /*
      Cleaning up so like this, there wont be any unintended behavior or
      to cause any performance issues
     */
    return () => {
      /* Used an example from here
      https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
      */
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Array to store the number of accidents for each valid weather condition
  const weatherCounts = [];

  // Getting the amount of accidents that happened for each weather condition
  for (let i = 0; i < validWeatherType.length; i++) {
    const weatherType = validWeatherType[i];

    if (events[weatherType]) {
      weatherCounts.push(events[weatherType].length);
    } else {
      weatherCounts.push(0);
    }
  }

  const data = [
    {
      x: validWeatherType,
      y: weatherCounts,
      hovertemplate: 'During the %{x} Weather Condition\n' +
                     '%{y} Accidents Happened<extra></extra>',
      marker: {
        color: [
          '#49899D',
          '#24AFE9',
          '#A9A9A9',
          '#496371',
          '#73D1DC',
          '#A7E9F4',
          '#FE8418'
        ]
      },
      type: 'bar'
    }
  ];

  const layout = {
    height: chartSize.height,
    width: chartSize.width,
    title: 'Accident Percent by Weather Condition',
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

  return (
    <figure>
      <h1 className="chartsH1">Accident Percent by Weather Condition</h1>
      <Plot
        data={data}
        layout={layout}
      />
    </figure>
  );
}
