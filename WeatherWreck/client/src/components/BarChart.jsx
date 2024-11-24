import { useState, useEffect } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';

/**
 * Function to dynamically get the chart size based on the screen width.
 * It adjusts the chart size for small, medium, and large screen widths.
 * 
 * @returns {number} width - The width of the chart.
 * @returns {number} height - The height of the chart.
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
    width = window.innerWidth - 90;
    height = 300;
  } else if (window.innerWidth >= 600 && window.innerWidth < 1200) {
    width = window.innerWidth - 150;
    height = 400;
  } else {
    width = 900;
    height = 500;
  }

  return { width, height };
};

/**
 * Displays a bar chart visualizing the number of accidents based on 
 * different weather conditions and the severities of the weather.
 * 
 * @component
 * @param {Object} events - An object where keys are weather conditions 
 * and values are arrays of accidents.
 * @param {Object} Plotly  - The imported plotly library
 * @param {string[]} validWeatherType - An array of valid weather conditions 
 * used to filter and display the accident data.
 */
export default function BarChart({ events, validWeatherType}) {
  // State to store the width and height for the chart
  const [chartSize, setChartSize] = useState(getChartSize());
  //Gets the global Plotly library
  // eslint-disable-next-line no-undef
  const Plot = createPlotlyComponent(Plotly);
  /**
   * Handles resizing of the window by updating the chart size.
   */
  const handleResize = () => {
    setChartSize(getChartSize());
  };

  // Update chart size on window resize
  useEffect(() => {
    /* Used an example from here
      https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth
    */ 
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => {
      /* Used an example from here
      https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
      */
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Define the weather severities 
  const weatherSeverities = ['Severe', 'Heavy', 'Moderate', 'Light', 'Other', 'UNK'];

  // Array to store the number of accidents for each valid weather condition
  const weatherCounts = [];

  // Data object to store counts of accidents for each severity level
  const severityCounts = {
    Severe: [],
    Heavy: [],
    Moderate: [],
    Light: [],
    Other: [],
    UNK: [],
  };

  // Getting the amount of accidents that happened for each weather condition
  for (let i = 0; i < validWeatherType.length; i++) {
    const weatherType = validWeatherType[i];

    if (events[weatherType]) {
      // Push the total accident count for this weather type
      weatherCounts.push(events[weatherType].length);

      // Initialize the severity count for each weather type
      weatherSeverities.forEach(severity => {
        severityCounts[severity].push(
          events[weatherType].filter(accident => accident.WeatherSeverity === severity).length
        );
      });
    } else {
      // If no accidents occurred for this weather condition, push zeros
      weatherCounts.push(0);
      weatherSeverities.forEach(severity => severityCounts[severity].push(0));
    }
  }

  // Main colors for each weather condition
  const weatherColors = {
    Cold: '#AB63FA',
    Fog: '#EF553B',
    Precipitation: '#FFA15A',
    Rain: '#636EFA',
    Snow: '#00CC96',
    Storm: '#BBBFFB'
  };

  // Add separate bars for each severity level with different opacities
  const opacityValues = {
    Severe: 0.8,
    Heavy: 0.7,
    Moderate: 0.6,
    Light: 0.5,
    Other: 0.4,
    UNK: 0.3,
  };

  // Helper function to apply opacity to color
  const getColorWithOpacity = (color, opacity) => {
    /**
     * Math.floor(opacity * 255) gives us an integer opacity value between 0 and 255.
     * toString(16) converts that integer to a hex value.
     * padStart(2, '0') ensures the hex opacity value is always two digits long 
     */
    return `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  const data = [];

  // Add the total accident count as a bar for each weather condition
  data.push({
    x: validWeatherType,
    y: weatherCounts,
    name: 'Total Accidents',
    type: 'bar',
    hovertemplate: '%{x}: %{y} accidents<extra></extra>',
    marker: {
      color: validWeatherType.map(weatherType => weatherColors[weatherType]),
    },
  });

  // Add separate bars for each severity level (next to the total accidents bar)
  weatherSeverities.forEach((severity) => {
    data.push({
      x: validWeatherType,
      y: severityCounts[severity],
      name: severity,
      type: 'bar',
      hovertemplate: `${severity} severity: %{y} accidents<extra></extra>`,
      marker: {
        color: validWeatherType.map((weatherType) => {
          // Getting the base color
          const baseColor = weatherColors[weatherType];
          // Getting the appropriate opacity
          const opacity = opacityValues[severity];
          // Apply different opacities for each severity level
          return getColorWithOpacity(baseColor, opacity);
        }),
      },
    });
  });
  
  const layout = {
    height: chartSize.height,
    width: chartSize.width,
    // Groups the bars next to each other
    scattermode: 'group',
    title: 'Accident Count by Weather Condition and Severity',
    xaxis: {
      title: 'Weather Condition',
    },
    yaxis: {
      title: 'Number of Accidents',
    },
    // Legend for severity levels
    legend: {
      title: {
        text: 'Condtion & Severity',
        side:'top center'
      },
      font: {
        size: 12
      },
      itemclick: 'toggleothers',
      bgcolor: '#ecf8ff',
      bordercolor: '#d7ecf8',
      borderwidth: 2,
    },
    // Makes the bars round at the top
    barcornerradius: 15,
    /* 
    Learned from here
    https://stackoverflow.com/questions/48798507/change-the-background-color-of-a-plot
    */
    'plot_bgcolor': '#e3f2fc',
    'paper_bgcolor': '#e3f2fc'
  };

  return (
    <figure>
      <h1 className="chartsH1">Accident Percent by Weather Condition and Severity</h1>
      <div className="chart-container">
        <Plot
          data={data}
          layout={layout}
        />
      </div>
    </figure>
  );
}
