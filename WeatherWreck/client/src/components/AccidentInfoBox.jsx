import './InfoBox.css';

export default function AccidentInfoBox({ details, onClose }) {
  if (!details) return null;

  return (
    <div className="info-box">
      <button onClick={onClose} className="close-btn">Close</button>
      <h3>Accident Details</h3>
      <p><strong>Weather Condition:</strong> Rain</p>
      <p><strong>Weather Severity:</strong> Light</p>
      <p><strong>Accident Severity:</strong> 3 </p>
      <p><strong>Description:</strong> Lane blocked due to accident on I-90 
      Kennedy Expy Eastbound at Exit 44A IL-19 Irving Park Rd</p>
      <p><strong>State:</strong> IL</p>
      <p><strong>City:</strong> Palestine</p>
      <p><strong>Date:</strong> 2022-01-02</p>
    </div>
  );
}