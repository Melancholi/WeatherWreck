
export default function Footer() {
  return (
<<<<<<< HEAD
    <>
      <section id="dataInfo">
        <section id="accidenInfo">
          <div className="accidentsAttribution">
            <p className="info">Data Taken From:</p>
            <a href="https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents"  target="_blank"
              className="info">
              US Accidents (2016 - 2023) made by sobhanmoosavi on kaggle
            </a>
          </div>
          <div className="accidentsAttribution">
            <p className="info">Accidents Dataset Attribution: </p>
            <a href="https://arxiv.org/abs/1902.06792" target="_blank" className="info">
              Short and Long-term Pattern Discovery Over Large-Scale Geo-Spatiotemporal Data
            </a>
          </div>
        </section> 
        
        <section id="weatherInfo">
          <div className="weatherAttribution">
            <p className="info">Data Taken From:</p>
            <a href="https://www.kaggle.com/datasets/sobhanmoosavi/us-weather-events" 
              target="_blank" className="info">
              US Weather Events (2016 - 2022) made by sobhanmoosavi on kaggle
            </a>
          </div>
          <div className="weatherAttribution">
            <p className="info">Weather Dataset Attributions: </p>
            <a href="https://arxiv.org/abs/1906.05409" target="_blank" className="info">
              A Countrywide Traffic Accident Dataset
            </a>
            <a href="https://arxiv.org/abs/1909.09638" target="_blank" className="info">
              Accident Risk Prediction based on Heterogeneous Sparse Data: New Dataset and Insights
            </a>
          </div>
        </section>
      </section>
      <br/>
      <footer>
        <div className="teammates">
          <p>Iana Feniuc</p>
          <p>Youry Nelson</p>
          <p>Maara Purici</p>
        </div>
      </footer>
    </>
=======
    <footer>
      <div className="teammates">
        <p>Iana</p>
        <p>Youry</p>
        <p>Maara</p>
      </div>
      
      <div className="accidentsAttribution">
        <p>https://arxiv.org/abs/1902.06792</p>
      </div>

      <div className="weatherAttribution">
        <p>https://arxiv.org/abs/1906.05409</p>
        <p>https://arxiv.org/abs/1909.09638</p>
      </div>
    </footer>
>>>>>>> d6d981c (Add basic header and footer)
  );
}