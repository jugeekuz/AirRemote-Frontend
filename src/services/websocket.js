import api from '../api/api'
import config from '../configs/config'
export const  wsHandler = async (endpoint, message, timeout, successResponseFormat, setStatus, setError) => {
	let socket;
	let timeoutId;
	const websocketJwtURL = `${config.apiUrl}/websocketJwt`;
	try{
		const response = await api({
			method: "GET",
			url: websocketJwtURL,
			headers: {
			'Content-Type': 'application/json',
			},
		});

		const data = JSON.parse(response.data.body);
		
		socket = new WebSocket(`${endpoint}&jwt=${data.jwt}`);

		socket.onopen = () => {
			socket.send(JSON.stringify(message));
			timeoutId = setTimeout(() => {
				setStatus('error');
				setError("Timeout reached without response from remote end.");
				socket.close();
			}, timeout);
		};

		socket.onmessage = (event) => {
			clearTimeout(timeoutId);
			if(successResponseFormat(event.data)){
				setStatus('success');
			} else {
				event?.data && (setError(event.data));
				setStatus('error');
				const response = JSON.parse(event.data);
			}
			socket.close();
		}

		socket.onerror = () => {
			clearTimeout(timeoutId);
			setStatus('error');
			setError("Unexpected error occured during websocket connection with remote end.");
			socket.close();
		}
	} catch (e) {
		console.log(`Received unexpected error during websocket connection : ${e}`)
	}
	return;
}
