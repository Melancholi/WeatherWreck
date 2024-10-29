import {useState, useEffect} from 'react';

export default function FetchData(){
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch('/api/accidents'); 
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if(loading){
    return <p> Loading ...</p>;
  }else{
    return( 
      <div>
        <h2> Accidents Data</h2>
        <ul> {data.map((item, index)=>(
          <li key={index}> {JSON.stringify(item)}</li>
        ))}
        </ul>
      </div>);
  } 
}