import FetchData from './fetchData.jsx';
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

export default function AccidentMap() {
  return (
    <div id="map">
      <h1>Temporary Accident Map Page</h1>
      <FetchData/>
    </div>
  );
}