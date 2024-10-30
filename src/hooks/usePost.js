import { useState } from 'react';
import api from "../api/api";

const usePost = (url) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const postItem = async (item) => {
    try {
      const response = await api({
        method: "POST",
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: item,
      });

      setSuccess(true);
      setData(response.data);
      return response.data;

    } catch (e) {
      setError(e.response ? e.response.statusText : e.message);
      console.error("Failed to post data:", e);
    } finally {
      setSuccess(false);
    }
  };

  return { postItem, success, error, data };
};

export default usePost;
