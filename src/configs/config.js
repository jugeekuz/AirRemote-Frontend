const config = {
	wssUrl: `${import.meta.env.VITE_WSS_URL}?deviceType=client`,
	apiUrl: `${import.meta.env.VITE_API_URL}`,
	authUrl: `${import.meta.env.VITE_AUTH_URL}`,
}

export default config;