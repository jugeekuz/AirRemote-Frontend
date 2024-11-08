import React, { createContext, useState, useEffect, useContext, useLayoutEffect, useRef } from 'react';
import { authenticate, refresh } from '../services/authenticate';
import config from '../configs/config';
import api from '../api/api';
const AuthContext = createContext();

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return authContext;
}

export const AuthProvider = ({ children }) => {
    const authUrl = config.authUrl;
    const [token, setToken] = useState();
    const isAuthenticated = !!token;
    const username = useRef("User");
    const decodeIdToken = (token) => {
        try {
            if (!token) return;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
    
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Invalid token", error);
            return null;
        }
    }
    

    useEffect(() => {
        const tokenPayload = decodeIdToken(token);
        username.current = tokenPayload ? tokenPayload.nickname : "User";
    }, [token])

    useLayoutEffect(() => {
        refresh()
        .then((res) => {
            setToken(res.data.id_token);
        })
        .catch((res) => setToken(null))
    },[])

    useLayoutEffect(() => {
        const authInterceptor = api.interceptors.request.use((config) => {
            config.headers.Authorization = 
                !config._retry && token 
                    ? `Bearer ${token}`
                    :config.headers.Authorization;
            
            return config;
        })
        return () => {
            api.interceptors.request.eject(authInterceptor);
        }
    }, [token])

    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use(            
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (
                    error?.response?.status === 401 &&
                    (
                        error?.response?.data?.message === 'Unauthorized' ||
                        error?.response?.data?.message === 'The incoming token has expired'
                    )
                ) {
                    try {
                        
                        const response = await refresh();
                        setToken(response.data.id_token);
                        
                        originalRequest.headers.Authorization = `Bearer ${response.data.id_token}`;
                        originalRequest._retry = true;

                        return api(originalRequest);
                    } catch {
                        setToken(null)
                    }
                }

                return Promise.reject(error);
            }
        )
        return () => {
            api.interceptors.request.eject(refreshInterceptor);
        }
    }, [])
    
    return (
        <AuthContext.Provider value={{ username , token, setToken, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
