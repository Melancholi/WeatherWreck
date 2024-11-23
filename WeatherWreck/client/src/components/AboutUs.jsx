

export default function AboutUs() {
  return (
    <>
      <section id="aboutUs">
        <div id="story">
          <h2>Our Story</h2>

          <div className="story-section">
            <h3>Who are we?</h3>
            <p>
              We are Iana Feniuc, Youry Nelson, and Maara Purici, final year students at Dawson College, 
              Montreal, QC, in the Computer Science program.
            </p>
            <p>
              For our final project for our Web Development V class, we were required to make a 
              full-stack MERN application that uses two large datasets.
            </p>
            <p>
              We chose to explore the intersection of accident events and weather conditions in the 
              United States during the year 2022.
            </p>
          </div>

          <div className="story-section">
            <h3>Why did we choose this topic for our project?</h3>
            <p>
              Our motivation stems from a deep concern about climate change and its potential 
              impacts on daily life, particularly its influence on road safety.
            </p>
            <p>
              By analyzing these datasets, we aim to investigate whether the changing climate and 
              increasingly unpredictable weather patterns may contribute to a rise in car accidents.
            </p>
            <p>
              Through this project, we hope to shed light on this critical issue and inspire 
              conversations about the broader consequences of climate change on public safety.
            </p>
          </div>

          <div className="story-section">
            <h3>The datasets we used for this project</h3>
            <p>This project was made possible thanks to the following datasets:</p>
            <dl>
              <dt>
                <a
                  href="https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents"
                  target="_blank"
                  className="info"
                >
                  US Accidents (2016 - 2023) by sobhanmoosavi on Kaggle
                </a>
              </dt>
              <dd>
                Provides detailed information about accidents in the USA during the years 2016 - 2023. 
              </dd>
              <dd>We used only accident events from 2022 due to the dataset's size.</dd>

              <dt>
                <a
                  href="https://www.kaggle.com/datasets/sobhanmoosavi/us-weather-events"
                  target="_blank"
                  className="info"
                >
                  US Weather Events (2016 - 2022) by sobhanmoosavi on Kaggle
                </a>
              </dt>
              <dd>
                Provides detailed information about weather events in the USA during the years 2016 - 2022. 
              </dd>
              <dd>We used only weather events from 2022 due to the dataset's size.</dd>
            </dl>
          </div>
        </div>

        <div id="howToUse">
          <h2>How to Use Our Page</h2>

          <div className="usage-section">
            <h3>For the Accidents Map Page</h3>
            <p>To view the map with all accidents, press the button "View Accidents Map."</p>
            <p>
              You will be presented with a map with markers across the USA representing different accidents.
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
            <p>To view charts, press the button "View Charts."</p>
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
    </>
  );
}
