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
    Based from https://plotly.com/javascript/sunburst-charts/
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
    height: 500,
    width: 500,
    margin: { t: 70, l: 0, r: 0, b: 20 },
    sunburstcolorway:[
      '#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A'
    ],
    title: 'Accident Severity by Weather Condition'
  };

  return (
    <figure>
      <h1>Accident Severity by Weather Condition</h1>
      <Plot
        data={data}
        layout={layout}
      />
    </figure>
  );
}