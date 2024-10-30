import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

const useFetchMemo = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api({
        method: "GET",
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setData(response.data.body);
    } catch (error) {
      setError(error.response ? error.response.statusText : error.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchMemo;