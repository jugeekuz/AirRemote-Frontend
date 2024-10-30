import { useState, useCallback } from "react";
import api from "../api/api";

const useDelete = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteItem = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await api({
        method: "DELETE",
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess(true); 
    } catch (e) {
      setError(e.response ? e.response.statusText : e.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { success, loading, error, refetch: deleteItem };
};

export default useDelete;
