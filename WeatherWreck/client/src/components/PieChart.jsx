import Plot from 'react-plotly.js';

/**
 * Shows accident severity breakdown by weather condition.
 */
export default function PieChart() {
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