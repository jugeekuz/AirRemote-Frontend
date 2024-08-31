export const  wsHandler = async (endpoint, message, timeout, successResponseFormat, setStatus, setError) => {
	let socket;
	let timeoutId;

    socket = new WebSocket(endpoint);

	socket.onopen = () => {
		console.log('loaded');
		console.log(JSON.stringify(message))
		socket.send(JSON.stringify(message));

		timeoutId = setTimeout(() => {
			setStatus('error');
			socket.close();
		}, timeout);
	};

    socket.onmessage = (event) => {
		clearTimeout(timeoutId);
		if(successResponseFormat(event.data)){
			console.log('sucess');
			console.log(event.data);
			setStatus('success');
		} else {
			console.log(event);
			event?.data && (setError(event.data));
			setStatus('error');
			const response = JSON.parse(event.data);
		}
		socket.close();
    }

	socket.onerror = () => {
		clearTimeout(timeoutId);
		setStatus('error');
		socket.close();
	}
	return;
}
