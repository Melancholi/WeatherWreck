import React from 'react';
import Plot from 'react-plotly.js';

export default function PieChart() {
  const data = [{
    values: [19, 26, 55],
    labels: ['Residential', 'Non-Residential', 'Utility'],
    type: 'pie'
  }];
  
  var layout = {
    height: 400,
    width: 500,
    title: "Test Pie Chart"
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