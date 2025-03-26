import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (url, page = 1, perPage = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('auth_token');  

        const response = await axios.get(url, {
          params: { page, per_page: perPage },
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setData(response.data.data);
        setTotalPages(response.data.meta.last_page);  
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, page, perPage]);

  return { data, loading, error, totalPages };
};

export default useFetchData;
