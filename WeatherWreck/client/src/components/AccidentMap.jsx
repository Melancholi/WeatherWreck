
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { Icon  } from 'leaflet';
import { useState, useEffect, lazy, Suspense} from 'react';
import FilterControl  from './FilterControl.jsx';
import { 
  MapContainer, 
  TileLayer, 
  Marker,
  Popup
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import IconSnow from '../assets/IconSnow.webp';
import IconCold from '../assets/IconCold.webp';
import IconFog from '../assets/IconFog.webp';
import IconRain from '../assets/IconRain.webp';
import IconPrecipitation from '../assets/IconPrecip.webp';
import IconStorm from '../assets/IconStorm.webp';
import bobLoadingImage from '../assets/bob.webp';

const AccidentInfoBox = lazy(
  () => import('./AccidentInfoBox.jsx')
);

const Legend = lazy(
  () => import( './Legend.jsx')
);
/**
 * Returns a custom Leaflet icon based on the weather condition type.
 * 
 * @param {string} weatherType - The type of weather condition (e.g., 'Snow', 'Rain').
 * @returns {Icon} A Leaflet Icon instance for the marker.
 */
function customIcon(weatherType){
  let icon;
  switch (weatherType) {
  case 'Snow':
    icon = IconSnow;
    break;
  case 'Rain':
    icon = IconRain;
    break;
  case 'Cold':
    icon = IconCold;
    break;
  case 'Fog':
    icon = IconFog;
    break;
  case 'Precipitation':
    icon = IconPrecipitation;
    break;
  default:
    icon = IconStorm;
  }
  return new Icon({
    iconUrl: icon,
    iconSize: [38, 38],
    iconAnchor: [22, 30]
  });
}

/**
 * The main component for rendering the accident map.
 * Handles filtering, marker rendering, and lazy-loaded UI components.
 * 
 * @returns {JSX.Element} The rendered AccidentMap component.
 */
export default function AccidentMap() {
  const attribution = 
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Current filter settings
  const [filterOption, setFilterOption] = useState({
    filterType : '',
    filterValue: ''
  });
  const [selectedAccident, setSelectedAccident] = useState(null);

  /**
   * Updates the filter options based on user input.
   * 
   * @param {Object} value - The filter configuration.
   */
  function onOptionChange(value){
    setFilterOption(value);
  }

  /**
   * Fetches accident data from the API based on the current filter settings.
   * Executes on initial render and whenever the filterOption changes.
   */
  useEffect(()=>{
    const fetchData = async () => {
      try {
        setLoading(true);
        let api = `/api/accidents/`;

        // Append filter query if filterType and filterValue are set
        if (filterOption.filterType !== '' && filterOption.filterValue !== '') {
          api += `/${filterOption.filterType}/${filterOption.filterValue}`;
        }
        const response = await fetch(api);
        const result = await response.json();

        setError(result.length ? null : 'No data found for the selected filter.'); 
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load data.`);
      } finally {
        setLoading(false);
      }
    };
    // Call the fetch function when component mounts
    fetchData();
  }, [filterOption]);
  
  /**
   * Fetches detailed information for a selected accident and updates state.
   * 
   * @param {string} accidentId - The ID of the accident.
   * @param {string} weatherId - The ID of the associated weather condition.
   */
  async function fetchAccidentDetails(accidentId, weatherId) {
    try {
      const response = await fetch(`/api/accidents/details/${accidentId}/${weatherId}`);
      const details = await response.json();
      setSelectedAccident(details);
    } catch (error) {
      console.error('Error fetching accident details:', error);
    }
  }
  /**
   * Renders accident markers on the map.
   * 
   * Uses the `MarkerClusterGroup` component to group markers dynamically.
   * Each marker is clickable to fetch and display additional accident details.
   * 
   * @returns {JSX.Element} The rendered marker cluster group.
   */
  function AccidentMarker(){
    return (
      <MarkerClusterGroup>
        {data.map((accident, index) => 
          <Marker 
            key={index} 
            position={[accident.Coordinates[1], accident.Coordinates[0]]} 
            icon={customIcon(accident.WeatherCondition)}
            eventHandlers={{
              click: () => fetchAccidentDetails(accident.AccidentID, accident.WeatherID),
            }}>
            <Popup>
              <p> Weather:{accident.WeatherCondition} </p>
            </Popup>
          </Marker>
        )}
      </MarkerClusterGroup>
    );
  }

  // Render loading screen when data is being fetched
  if(loading){
    return (
      <>
        <div className="loading-container"> 
          <img src={bobLoadingImage} alt="Please wait" 
            className="loading-image" />
          <p>I know, I know... Wait patiently... It&apos;s loading ...</p>
        </div>
      </>);
  }else{
    // Render the map and UI components
    return (
      <div id="displayMap">
        {error && <div id="error-message">{error}</div>}
        <div id="ui-container">
          <div id="ui-contrlos">
            {/* Error message display */}
            <div id="panel">
              <div id="filters">
                <FilterControl setFilter={onOptionChange}/>
              </div>
              <div id="legend">
                <Suspense fallback={<div>Loading legend...</div>}>
                  <Legend />
                </Suspense>
              </div>
            </div>
            {/* See leaflet-container CSS class */}
            <MapContainer
              center={[39.8183, -98.5795]}
              zoom={4.5}
              zoomControl={true}
              updateWhenZooming={false}
              updateWhenIdle={true}
              preferCanvas={true}
              minZoom={3}
              maxZoom={16}
            >
              <TileLayer
                attribution={attribution}
                url={tileUrl}
              />
              {data.length > 0 ? <AccidentMarker /> : null}
            </MapContainer>
          </div>
        </div>
        <div id="info-box-map">
          {/* Lazy loading the AccidentInfoBox  */}
          <Suspense fallback={
            <div className="loading">
              <p>Loading Accident Information...</p>
            </div>
          }>
            <AccidentInfoBox details={selectedAccident} onClose={() => setSelectedAccident(null)} />
          </Suspense>
        </div>
      </div>
    );
  }
}