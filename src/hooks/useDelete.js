import { useState, useCallback } from "react";

const useDelete = (url) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const deleteItem = useCallback(async (url) => {
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			const response = await fetch(url,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				});
			const data = await response.json();
			if (!response?.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			setSuccess(true);
			
		} catch(e) {
			setError(e);
		} finally {
			setLoading(false);
		}
	}, [url]);

	

	return { success, loading, error, refetch: deleteItem };
}

export default useDelete;