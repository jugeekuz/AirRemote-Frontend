import { useState, useEffect, useCallback } from "react";

const useFetchMemo = (url) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	const fetchData = useCallback(async () => {
		setLoading(true);
    	setError(null);

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			console.log("Refetched")
			console.log(result.body)
			setData(result.body);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
			
	}, [url]);

	useEffect(() => {
		fetchData();
	}, [fetchData])
	return { data, loading, error, refetch: fetchData };
}

export default useFetchMemo;