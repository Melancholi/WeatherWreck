import FetchData from './fetchData.jsx';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { Icon  } from 'leaflet';
import { useState, useEffect} from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker,
  Popup
} from 'react-leaflet';

export default function AccidentMap() {
  const attribution = 
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const [error, setError] = useState(null);

  return (
    <div className="ui-container">
      <div className ="ui-controls">
      </div>
      {/* Error message display */}
      {error && <div>{error}</div>}

      {/* See leaflet-container CSS class */}
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
        
      </MapContainer>
      
    </div>
  );
}