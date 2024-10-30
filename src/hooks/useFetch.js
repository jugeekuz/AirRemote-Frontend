import { useState, useEffect } from 'react';
import api from '../api/api';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api({
          method: "GET",
          url: url,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        setData(response.data.body);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.response ? err.response.statusText : err.message);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading, error };
};

export default useFetch;