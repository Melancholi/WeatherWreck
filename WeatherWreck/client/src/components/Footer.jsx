
export default function Footer() {
  return (
    <footer>
      <div className="teammates">
        <p>Iana Feniuc</p>
        <p>Youry Nelson</p>
        <p>Maara Purici</p>
      </div>
      
      <div className="accidentsAttribution">
        <p>Accidents Dataset Attribution: </p>
        <a href="https://arxiv.org/abs/1902.06792" target="_blank">Short and Long-term Pattern Discovery Over Large-Scale Geo-Spatiotemporal Data</a>
      </div>

      <div className="weatherAttribution">
        <p>Weather Dataset Attributions: </p>
        <a href="https://arxiv.org/abs/1906.05409" target="_blank">A Countrywide Traffic Accident Dataset</a>
        <a href="https://arxiv.org/abs/1909.09638" target="_blank">Accident Risk Prediction based on Heterogeneous Sparse Data: New Dataset and Insights</a>
      </div>
    </footer>
  );
}