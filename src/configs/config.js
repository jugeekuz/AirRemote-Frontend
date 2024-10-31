const config = {
	baseUrl: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_STAGE}`,
	apiUrl: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_STAGE}/api`,
	authUrl: `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_STAGE}/auth`,
	wssUrl: `${import.meta.env.VITE_WSS_URL}/${import.meta.env.VITE_STAGE}?deviceType=client`,
}

export default config;