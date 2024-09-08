import { useState, useRef } from 'react';

const useAdd = (url) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const addItem = async (item) => {
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        setError(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSuccess(true);
      const result = await response.json();
      setData(result);
      return result;
    } catch (e) {
      setError(e.message);
      console.error("Failed to fetch data:", e);
    } finally {
      setSuccess(false);
    }
  };

  return { addItem, success, error, data };
};

export default useAdd;