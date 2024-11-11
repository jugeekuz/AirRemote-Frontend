const config = {
	wssUrl: `${import.meta.env.VITE_WSS_URL}?deviceType=client`,
	apiUrl: `${import.meta.env.VITE_API_URL}`,
	authUrl: `${import.meta.env.VITE_AUTH_URL}`,
	redirectUri: `${window.location.origin}/oauth2/callback`,
	appClientId: `${import.meta.env.VITE_APP_CLIENT_ID}`,
	cognitoDomain: `${import.meta.env.VITE_COGNITO_DOMAIN}`,
}

export default config;