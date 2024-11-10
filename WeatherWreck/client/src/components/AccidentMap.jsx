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
    <div id="main">
      <section>
        <FilterControl setFilter={onOptionChange}/>
      </section>
      <h1>Temporary Accident Map Page</h1>
    </div>
  );
}