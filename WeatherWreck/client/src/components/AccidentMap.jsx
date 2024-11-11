// eslint-disable-next-line no-unused-vars
import FetchData from './fetchData.jsx';
import FilterControl  from './FilterControl.jsx';
import {useState} from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { Icon  } from 'leaflet';
import { 
  MapContainer, 
  TileLayer, 
  Marker,
  Popup,
  Polyline
} from 'react-leaflet';
import markerImage from '../assets/marker-icon.png';


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
  // eslint-disable-next-line no-unused-vars
  const [filterOption, setFilterOption] = useState({
    filterType : '',
    filterValue: ''
  });
  function onOptionChange(value){
    setFilterOption(value);
  }

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
          <Marker 
            key={'times-square'} 
            position={[40.7580, -73.9855]} 
            icon={customIcon}>
            <Popup>
              <p> 
              Times Square, NYC - More Info
              </p>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}