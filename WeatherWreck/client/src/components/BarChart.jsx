import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

/**
 * Function to dynamically get the chart size based on the screen width
 */ 
const getChartSize = () => {
  let width; 
  let height;

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
 * different weather conditions and severities.
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
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Define the weather severities
  const weatherSeverities = ["Heavy", "Light", "Moderate", "Other", "Severe", "UNK"];

  // Array to store the number of accidents for each valid weather condition
  const weatherCounts = [];

  // Data object to store counts of accidents for each severity level
  const severityCounts = {
    Heavy: [],
    Light: [],
    Moderate: [],
    Other: [],
    Severe: [],
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
  const weatherColors = [
    '#49899D',
    '#24AFE9',
    '#A9A9A9',
    '#496371',
    '#73D1DC',
    '#A7E9F4',
    '#FE8418'
  ];

  // Prepare the bar chart data
  const data = [];

  // Add the total accident count as a bar for each weather condition
  data.push({
    x: validWeatherType,
    y: weatherCounts,
    name: 'Total Accidents',
    type: 'bar',
    hovertemplate: '%{x}: %{y} accidents<extra></extra>',
    marker: {
      color: weatherColors,
    },
  });

  // Add separate bars for each severity level (next to the total accidents bar)
  weatherSeverities.forEach((severity, severityIndex) => {
    data.push({
      x: validWeatherType,
      y: severityCounts[severity],
      name: severity,
      type: 'bar',
      hovertemplate: `${severity} severity: %{y} accidents<extra></extra>`,
      marker: {
        color: weatherColors.map((color, index) => {
          // Adjust the opacity for severity breakdowns to keep it distinguishable
          return index === severityIndex ? color : `${color}90`;
        }),
      },
    });
  });

  // Chart layout
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
    legend: {
      title: {
        text: 'Severity',
      },
    },
    // Makes the bars round at the top
    barcornerradius: 15
  };

  return (
    <figure>
      <h1 className="chartsH1">Accident Count by Weather Condition and Severity</h1>
      <Plot
        data={data}
        layout={layout}
      />
    </figure>
  );
}
