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
import markerImage from '../assets/IconSnow.png';


/**
 * Custom icon for map markers.
 * @type {Icon}
 */
const customIcon = new Icon({
  iconUrl: markerImage,
  iconSize: [38, 38],
  iconAnchor: [22, 30]
});

export default function AccidentMap() {
  const attribution = 
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/accidents/`);
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load data.`);
      } finally {
        setLoading(false);
      }
    };
    // Call the fetch function when component mounts
    fetchData();
  }, []);

  function AccidentMarker(){
    return (
      <>
        {data.map((accident, index) => 
          <Marker 
            key={index} 
            position={[accident.Coordinates[1], accident.Coordinates[0]]} 
            icon={customIcon}>
            <Popup>
              <p> More info</p>
            </Popup>
          </Marker>
        )}
      </>
    );
  }

  
  if(loading){
    return <p> Loading ...</p>;
  }else{
    return (
      <div className="ui-container">
        <div className ="ui-controls">
          <label>
            <input 
              type ="radio" 
              name="mode" 
              value="info" 
            /> data
          </label>
          <label>
            <input 
              type ="radio" 
              name="mode" 
              value="history"
            /> state
          </label>
        </div>
        {/* Error message display */}
        {error && <div>{error}</div>}
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
            <AccidentMarker />
          </MapContainer>
        </div>
        <div id="legend">
          <Legend />
        </div>
      </div>
    );
  }
}