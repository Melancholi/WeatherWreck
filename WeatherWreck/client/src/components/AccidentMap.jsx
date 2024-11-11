import FetchData from './fetchData.jsx';
import FilterControl  from './FilterControl.jsx';
import {useState} from 'react';
export default function AccidentMap() {
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
      <FetchData/>
    </div>
  );
}