import { useState, useEffect } from 'react';

const useFetch = (url) => {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		fetch(url)
		.then(response => {
			if (!response.ok) { 
			// error coming back from server
			throw Error('could not fetch the data for that resource');
			} 
			return response.json();
			
		})
		.then(data => {
			setData(data.body);
			setIsLoading(false);
			setError(null);
		})
		.catch(err => {
			setIsLoading(false);
			setError(err.message);
		})
	}, [url])

	return { data, isLoading, error };
}

export default useFetch;
