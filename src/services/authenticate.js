import axios from 'axios';
import config from '../configs/config';
export const authenticate = async (email, password)=>{
    const loginUrl = `${config.authUrl}/login`
    try {
        const payload = {
            email: email,
            password: password,
        };

        const response = await axios.post(loginUrl, payload, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        throw error;
    }      
};

export const logout = async () => {
    const logoutUrl = `${config.authUrl}/logout`
    try {
        const response = await axios.post(logoutUrl, null, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error('Logout failed:', error.response ? error.response.data : error.message);
    }
    
};

export const signup = async (username, email, password) => {
    const signupUrl = `${config.authUrl}/signup`
    const item = {
        nickname: username,
        email: email,
        password: password
    }
    try {
        const response = await axios.post(signupUrl, item, {
            headers: {
              'Content-Type': 'application/json',
            }
        });
    
        return response;
    } catch (error) {
        throw error;
    }
}

export const refresh = async () => {
    const refreshUrl = `${config.authUrl}/refresh-token`;
    try {
        const response = await axios.post(refreshUrl, {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
              }
        })
        return response;
    } catch (error) {
        throw error;
    }
}