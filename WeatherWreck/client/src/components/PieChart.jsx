import Plot from 'react-plotly.js';


/**
 * Pie chart Component that displays the correllation bewteen the severity of car accidents and
 *  weather events
 * @param {ArrayObject} weatherOfAccidents - Array containing list of weather events 
 * and their accidents
 * @returns {JSX.Element} A sunburst chart displaying accident severity depending on the 
 * weather
 */
export default function PieChart({weatherOfAccidents}) {
  /*
    Example from https://plotly.com/javascript/pie-charts/
    I used the example for the "Basic Pie Chart"
  */
  const data = [{
    values: [19, 26, 55],
    labels: ['Residential', 'Non-Residential', 'Utility'],
    type: 'pie'
  }];
  
  var layout = {
    height: 500,
    width: 500,
    title: 'Test Pie Chart'
  };

  return (
    <div>
      <h1>Temporary PieChart Display</h1>
      <Plot
        data={data}
        layout={layout}
      />
    </div>
  );
}