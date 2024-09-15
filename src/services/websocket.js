export const  wsHandler = async (endpoint, message, timeout, successResponseFormat, setStatus, setError) => {
	let socket;
	let timeoutId;

    socket = new WebSocket(endpoint);

	socket.onopen = () => {
		socket.send(JSON.stringify(message));
		console.log("Websocket connection started");
		console.log(`Sending message : ${JSON.stringify(message)}`)
		timeoutId = setTimeout(() => {
			setStatus('error');
			setError("Timeout reached without response from remote end.");
			socket.close();
		}, timeout);
	};

    socket.onmessage = (event) => {
		clearTimeout(timeoutId);
		console.log(`received ${event.data}`)
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
		setError("Unexpected error occured during websocket connection with remote end.");
		socket.close();
	}
	return;
}