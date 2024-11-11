import {useState, useEffect} from 'react';
import FilterControl  from './FilterControl.jsx';
/**
 * This component fetches accident data from an API and displays it in a list format.
 * Initially, it shows a loading message until the data is retrieved.
 * 
 * @component
 * @returns {JSX.Element} - The rendered component with either loading text or a list of accidents.
 */
export default function FetchData(){
  // State to hold the fetched data
  const [data, setData] = useState([]);
  const [filterOption, setFilterOption] = useState({
    filterType : '',
    filterValue: ''
  });
  const [loading, setLoading] = useState(true);

  function onOptionChange(value){
    setFilterOption(value);
  }

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch('/api/accidents/'); 
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    // Call the fetch function when component mounts
    fetchData();
  }, []);

  // Display loading message while fetching data
  if(loading){
    return <p> Loading ...</p>;
  }else{
    // Display fetched data as a list once loaded
    return( 
      <div>
        <FilterControl setFilter={onOptionChange}/>
        <h2> Accidents Data</h2>
        <p> {filterOption.filterType} {filterOption.filterValue}</p>
        <ul> {data.map((item, index)=>
          <li key={index}> {JSON.stringify(item)}</li>
        )}
        </ul>
      </div>);
  } 
}
