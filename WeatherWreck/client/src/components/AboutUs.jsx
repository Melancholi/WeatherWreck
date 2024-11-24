import {lazy, Suspense} from 'react';
import './AboutUs.css';

const Usage = lazy(
  () => import('./Usage.jsx')
);

export default function AboutUs() {
  return (
    <>
      <section id="aboutUsStory">
        <div id="story">
          <h2>Our Story</h2>

          <div className="story-section">
            <h3>Who are we?</h3>
            <p>
              We are Iana Feniuc, Youry Nelson, and Maara Purici, final year students at Dawson  
              College, Montreal, QC, in the Computer Science program.
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
                Provides detailed information about accidents in the USA during the years 
                2016 - 2023. 
              </dd>
              <dd>We used only accident events from 2022 due to the size of the dataset.</dd>

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
                Provides detailed information about weather events in the USA during the years 
                2016 - 2022. 
              </dd>
              <dd>We used only weather events from 2022 due to the size of the dataset.</dd>
            </dl>
          </div>
        </div>
      </section>

      {/* Lazy-loaded Usage */}
      <Suspense fallback={<div>Loading usage information...</div>}>
        <Usage />
      </Suspense>
    </>
  );
}
