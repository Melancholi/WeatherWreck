import Plot from 'react-plotly.js';

export default function BarChart() {
  /*
    Example from https://plotly.com/javascript/bar-charts/
    I used the example for the "Basic Bar Chart"
  */
  const data = [
    {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [20, 14, 23],
      type: 'bar'
    }
  ];

  var layout = {
    height: 500,
    width: 500,
    title: 'Test Bar Chart'
  };

  return (
    <div>
      <h1>Temporary BarChart Display</h1>
      <Plot
        data={data}
        layout={layout}
      />
    </div>
  );
}
