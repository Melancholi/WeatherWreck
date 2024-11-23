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
 * Pie chart Component that displays the correllation bewteen the severity of car accidents and
 *  weather events
 * @param {ArrayObject} weatherOfAccidents - Array containing list of weather events 
 * and their accidents
 * @param {Object} Plotly  - The imported plotly library
 * @returns {JSX.Element} A sunburst chart displaying accident severity depending on the 
 * weather
 */
export default function PieChart({weatherOfAccidents, Plotly}) {
  //Transform plotly object into react component
  const Plot = createPlotlyComponent(Plotly);
  // State to store the width and height for the chart
  const [chartSize, setChartSize] = useState(getChartSize());

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

  /*
    Based from https://plotly.com/javascript/sunburst-charts/
  */
  const values = [];
  const labels = [];
  const parents = [];
  Object.entries(weatherOfAccidents).forEach(([weatherCondition, accidents])=>{
    const severity = {'1':0, '2':0, '3':0, '4':0};

    //First set the quantities for the severity
    accidents.forEach(accident =>{
      severity[accident.AccidentSeverity]++;
    });

    //sets up the hierarchy
    labels.push(weatherCondition);
    parents.push('');
    values.push(accidents.length);
    //Add the values to display
    Object.entries(severity).forEach(([severity, count]) => {
      labels.push(`Severity ${severity}`);
      parents.push(weatherCondition);
      values.push(count);
    });

  });

  const data = [{
    labels: labels,
    parents: parents,
    values: values,
    type: 'sunburst',
    branchvalues: 'total',
    outsidetextfont: { size: 20, color: '#377eb8' },
    marker: { line: { width: 5 } },
    insidetextorientation: 'auto',
    textinfo:'label+value+percent parent',
    textfont: { size: 14 }, 
  }];

  const layout = {
    height: chartSize.height,
    width: chartSize.width,
    margin: { t: 70, l: 0, r: 0, b: 20 },
    sunburstcolorway:[
      '#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A'
    ],
    title: 'Accident Severity by Weather Condition',
    'paper_bgcolor': '#e3f2fc'
  };

  return (
    <figure>
      <h1 className="chartsH1">Accident Severity by Weather Condition</h1>
      <div className="chart-container">
        <Plot
          data={data}
          layout={layout}
        />
      </div>
    </figure>
  );
}