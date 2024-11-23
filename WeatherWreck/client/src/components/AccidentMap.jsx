
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

const Legend = lazy(() => import( './Legend.jsx'));
/**
 * Custom icons for map markers.
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
export default function AccidentMap() {
  const attribution = 
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState({
    filterType : '',
    filterValue: ''
  });
  const [selectedAccident, setSelectedAccident] = useState(null);


  function onOptionChange(value){
    setFilterOption(value);
  }

  useEffect(()=>{
    const fetchData = async () => {
      try {
        setLoading(true);
        let api = `/api/accidents/`;

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

  async function fetchAccidentDetails(accidentId, weatherId) {
    try {
      const response = await fetch(`/api/accidents/details/${accidentId}/${weatherId}`);
      const details = await response.json();
      setSelectedAccident(details);
    } catch (error) {
      console.error('Error fetching accident details:', error);
    }
  }
  
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
                <Legend />
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