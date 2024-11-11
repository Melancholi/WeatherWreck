import {useState} from 'react';
import '../FilterControl.css';
export default function FilterControl({setFilter}){
  const [filterType, setFilterType] = useState('');
  return (
    <search id="FilterControlSection">
      <h3 id="SearchHeader">SEARCH OPTIONS</h3>
      <section id="SearchSection">
        <select
          id="FilterChoice"
          value={filterType}
          onChange={e =>setFilterType(e.target.value)}>
          <option value="state">State</option>
          <option value="city">City</option>
          <option value="type">Weather</option>
          <option value="date">Date</option>
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