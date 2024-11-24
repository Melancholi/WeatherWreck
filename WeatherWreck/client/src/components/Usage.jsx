export default function Usage() {
  return (
    <section id="aboutUsUsage">
      <div id="howToUse">
        <h2>How to Use Our Page</h2>

        <div className="usage-section">
          <h3>For the Accidents Map Page</h3>
          <p>
            To view the map with all accidents, press the button &quot;View Accidents Map.&quot;
          </p>
          <p>
            You will be presented with a map with markers across the USA representing different 
            accidents.
          </p>
          <p>A panel on the left side provides several search options:</p>
          <dl>
            <dt>Search by State</dt>
            <dd>Select a state to view accidents from that location.</dd>

            <dt>Search by Severity</dt>
            <dd>Select the weather severity to view accidents across the USA.</dd>

            <dt>Search by Weather</dt>
            <dd>Select a weather condition to view accidents associated with it.</dd>

            <dt>Search by Date</dt>
            <dd>Use a calendar to select a date and see accidents from that day.</dd>
          </dl>
          <p>
            A legend explains what each marker color represents. Clicking a marker displays more 
            accident details.
          </p>
        </div>

        <div className="usage-section">
          <h3>For the Charts Page</h3>
          <p>To view charts, press the button &quot;View Charts.&quot;</p>
          <p>
            You will see a panel allowing you to select either the bar chart or the pie chart. 
            By default, the bar chart is displayed.
          </p>
          <p>
            The bar chart shows accident percentages during specific weather conditions, 
            including severity analysis.
          </p>
          <p>
            The pie chart shows the proportion of accidents during specific weather conditions, 
            categorized by severity.
          </p>
        </div>
      </div>
    </section>
  );
}