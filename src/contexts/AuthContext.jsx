import React, { createContext, useState, useEffect, useContext, useLayoutEffect } from 'react';
import { authenticate } from '../services/authenticate';
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
    const [token, setToken] = useState();
    const isAuthenticated = !!token;
    const authUrl = config.authUrl;

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
                        
                        const response = await api({
                            method: "POST",
                            url: "/auth/refresh-token",
                            withCredentials: true,
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          })                        
                        
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
        <AuthContext.Provider value={{ token, setToken, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
