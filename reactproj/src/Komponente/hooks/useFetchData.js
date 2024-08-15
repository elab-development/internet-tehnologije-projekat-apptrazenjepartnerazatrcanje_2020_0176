import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('auth_token');  
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [url]);

  return [data, setData];
};

export default useFetchData;
