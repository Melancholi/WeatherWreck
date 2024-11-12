// eslint-disable-next-line no-unused-vars
import FetchData from './fetchData.jsx';
import FilterControl  from './FilterControl.jsx';
import {useState} from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import Legend from './Legend.jsx';
import { Icon  } from 'leaflet';
import { 
  MapContainer, 
  TileLayer, 
  Marker,
  Popup,
  Polyline
} from 'react-leaflet';
import IconSnow from '../assets/IconSnow.png';
import IconCold from '../assets/IconCold.png';
import IconFog from '../assets/IconFog.png';
import IconRain from '../assets/IconRain.png';
import IconPrecipitation from '../assets/IconPrecip.png';
import IconStorm from '../assets/IconStorm.png';
import bobLoadingImage from '../assets/bob.png';
/**
 * Custom icon for map markers.
 * @type {Icon}
 */
// const customIcon = new Icon({
//   iconUrl: markerImage,
//   iconSize: [38, 38],
//   iconAnchor: [22, 30]
// });
function customIcon(weatherType){
  let icon;
  if(weatherType === 'Snow'){
    icon = IconSnow;
  } else if(weatherType === 'Rain'){
    icon = IconRain;
  } else if(weatherType === 'Cold'){
    icon = IconCold;
  } else if(weatherType === 'Fog'){
    icon = IconFog;
  } else if(weatherType === 'Precipitation'){
    icon = IconPrecipitation;
  } else{
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState({
    filterType : '',
    filterValue: ''
  });

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

        // if (result.length === 0) {
        //   setError('No data found for the selected filter.');
        // } else {
        //   setError(null);
        // }

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

  function AccidentMarker(){
    return (
      <>
        {data.map((accident, index) => 
          <Marker 
            key={index} 
            position={[accident.Coordinates[1], accident.Coordinates[0]]} 
            icon={customIcon(accident.WeatherCondition)}>
            <Popup>
              <p> Weather:{accident.WeatherCondition} </p>
            </Popup>
          </Marker>
        )}
      </>
    );
  }

  
  if(loading){
    return (
      <div className="loading-container"> 
        <img src={bobLoadingImage} alt="Please wait" className="loading-image" />
        <p>I know, I know... Wait patiently... It&apos;s loading ...</p>
      </div>);
  }else{
    return (
      <div className="ui-container">
        {/* Error message display */}
        {error && <div>{error}</div>}
        <div id="main">
          <FilterControl setFilter={onOptionChange}/>
        </div>
        {/* See leaflet-container CSS class */}
        <div id="map">
          <MapContainer
            center={[39.8283, -98.5795]}
            zoom={4}
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
        <div id="legend">
          <Legend />
        </div>
      </div>
    );
  }
}