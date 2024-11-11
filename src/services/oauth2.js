import crypto from 'crypto-js';
import config from '../configs/config';

export const initiateOAuthFlow = (identity_provider) => {
    const state = crypto.lib.WordArray.random(16).toString();
    const authorizeParams = new URLSearchParams({
        response_type: 'code',
        client_id: config.appClientId,
        redirect_uri: config.redirectUri,
        state,
        identity_provider: identity_provider,
        scope: 'profile email openid',
    });

    window.location.href = `${config.cognitoDomain}/oauth2/authorize?${authorizeParams.toString()}`;
}

export default initiateOAuthFlow;