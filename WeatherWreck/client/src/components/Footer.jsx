import './Footer.css';
export default function Footer() {
  return (
    <>
      <section id="dataInfo">
        <section id="accidenInfo">
          <div className="accidentsAttribution">
            <p className="infoP">Accidents Dataset Attribution: </p>
            <a href="https://arxiv.org/abs/1902.06792" target="_blank" className="infoA">
              Short and Long-term Pattern Discovery Over Large-Scale Geo-Spatiotemporal Data
            </a>
          </div>
        </section> 
        
        <section id="weatherInfo">
          <div className="weatherAttribution">
            <p className="infoP">Weather Dataset Attributions: </p>
            <a href="https://arxiv.org/abs/1906.05409" target="_blank" className="infoA">
              A Countrywide Traffic Accident Dataset
            </a>
            <a href="https://arxiv.org/abs/1909.09638" target="_blank" className="infoA">
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
  );
}