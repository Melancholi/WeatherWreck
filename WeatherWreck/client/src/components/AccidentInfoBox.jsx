import './InfoBox.css';

export default function AccidentInfoBox({ details, onClose }) {
  if (!details) return null;

  return (
    <div className="info-box">
      <div id='titleButton'>
        <h3>Accident Details</h3>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
      <p><strong>Weather Condition:</strong> {details.WeatherCondition}</p>
      <p><strong>Weather Severity:</strong> {details.WeatherSeverity}</p>
      <p><strong>Accident Severity:</strong> {details.AccidentSeverity}</p>
      <p><strong>Description:</strong> {details.Description}</p>
      <p><strong>State:</strong> {details.State}</p>
      <p><strong>City:</strong> {details.City}</p>
      <p><strong>Date:</strong> {new Date(details.Date).toLocaleDateString()}</p>
    </div>
  );
}