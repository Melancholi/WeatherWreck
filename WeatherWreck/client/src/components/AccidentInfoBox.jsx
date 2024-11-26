import './InfoBox.css';

/**
 * Displays detailed information about a selected accident.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object|null} props.details - The details of the selected accident. 
 * If null, the component renders nothing.
 * @param {Function} props.onClose - Callback function to close the info box.
 * @returns {JSX.Element|null} A styled info box with accident details or null 
 * if no details are available.
 */
export default function AccidentInfoBox({ details, onClose }) {
  // If no details are passed, return null (do not render the component).
  if (!details) return null;
  return (
    <div className="info-box">
      <div id="titleButton">
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