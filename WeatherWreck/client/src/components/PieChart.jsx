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
    Example from https://plotly.com/javascript/sunburst-charts/
  */
  const values = [];
  const labels = [];
  const parents = [];
  Object.entries(weatherOfAccidents).forEach(([weatherCondition, accidents])=>{
    const severity = {'1':0, '2':0, '3':0, '4':0};

    //First set the quantities for the severity
    accidents.forEach(accident =>{
      severity[accident.Accident_Severity]++;
    });

    //sets up the hierarchy
    labels.push(weatherCondition);
    parents.push('');
    values.push(accidents.length);
    //Add the values to display
    Object.entries(severity).forEach(([severity, count]) => {
      if (count > 0) {
        labels.push(`Severity ${severity}`);
        parents.push(weatherCondition);
        values.push(count);
      }
    });

  });

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