import {useState} from 'react';
import '../FilterControl.css';
export default function FilterControl({setFilter}){
  const [filterType, setFilterType] = useState('');
  return (
    <search>
      <h3>SEARCH BY</h3>
      <section id="SearchSection">
        <select
          id="FilterChoice"
          value={filterType}
          onChange={e =>setFilterType(e.target.value)}>
          <option value="State">State</option>
          <option value="City">City</option>
          <option value="Weather">Weather</option>
          <option value="Date">Date</option>
        </select>
        {filterType !== '' & filterType !== 'Date' ?
          <input type="text" id="filterValue" 
            onChange={(e) =>
              setFilter({filterType: filterType,
                filterValue: e.target.value
              })}/> 
          : null}

        {filterType === 'Date' ?
          <input type="date" id="filterValue"
            min="2020-06-30" max="2022-06-30"
            onChange={(e) =>
              setFilter({filterType: filterType,
                filterValue: e.target.value
              })}/>
          : null}
      </section>
    </search>
  );
}