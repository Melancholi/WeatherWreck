import {useState} from 'react';
import './FilterControl.css';
export default function FilterControl({setFilter}){
  const [filterType, setFilterType] = useState('');
  const [states] = useState([
    { name: 'Alabama', abbreviation: 'AL' },
    { name: 'Alaska', abbreviation: 'AK' },
    { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'California', abbreviation: 'CA' },
    { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' },
    { name: 'Delaware', abbreviation: 'DE' },
    { name: 'Florida', abbreviation: 'FL' },
    { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Hawaii', abbreviation: 'HI' },
    { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' },
    { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Kentucky', abbreviation: 'KY' },
    { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' },
    { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Minnesota', abbreviation: 'MN' },
    { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' },
    { name: 'Montana', abbreviation: 'MT' },
    { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Nevada', abbreviation: 'NV' },
    { name: 'New Hampshire', abbreviation: 'NH' },
    { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' },
    { name: 'New York', abbreviation: 'NY' },
    { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Ohio', abbreviation: 'OH' },
    { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' },
    { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'South Dakota', abbreviation: 'SD' },
    { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' },
    { name: 'Utah', abbreviation: 'UT' },
    { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Washington', abbreviation: 'WA' },
    { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' },
    { name: 'Wyoming', abbreviation: 'WY' }
  ]);
  const [weatherTypes] = useState([
    'Rain', 'Snow', 'Precipitation', 'Fog', 'Storm', 'Cold'
  ]);

  const [severities] = useState(['Light', 'Moderate', 'Heavy']);
  return (
    <search id="FilterControlSection">
      <h3 id="SearchHeader">SEARCH OPTIONS</h3>
      <section id="SearchSection">
        <select
          id="FilterChoice"
          value={filterType}
          onChange={e =>setFilterType(e.target.value)}>
          <option value="">Select Filter</option>
          <option value="state">State</option>
          <option value="severity">Severity</option>
          <option value="type">Weather</option>
          <option value="date">Date</option>
        </select>

        {filterType === 'state' && (
          <select
            id="filterValue"
            onChange={(e) => setFilter({ filterType, filterValue: e.target.value })}>
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state.abbreviation}>
                {state.name} ({state.abbreviation})
              </option>
            ))}
          </select>
        )}

        {filterType === 'severity' && (
          <select
            id="filterValue"
            onChange={(e) => setFilter({  filterType: filterType, filterValue: e.target.value })}>
            <option value="">Select Severity</option>
            {severities.map((severity, index) => (
              <option key={index} value={severity}>
                {severity}
              </option>
            ))}
          </select>
        )}

        {filterType === 'type' && (
          <select
            id="filterValue"
            onChange={(e) => setFilter({  filterType: filterType, filterValue: e.target.value })}>
            <option value="">Select Weather Type</option>
            {weatherTypes.map((weather, index) => (
              <option key={index} value={weather}>
                {weather}
              </option>
            ))}
          </select>
        )}
        {filterType === 'date' && (
          <input
            type="date"
            id="filterValue"
            min="2022-01-30"
            max="2022-12-31"
            onChange={(e) => setFilter({  filterType: filterType, filterValue: e.target.value })}
          />
        )}
      </section>
    </search>
  );
}