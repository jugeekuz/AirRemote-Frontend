import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@nextui-org/react';
import { useAuth } from '../contexts/AuthContext';
import config from '../configs/config';
import axios from 'axios';

const OAuth2Callback = () => {
    const navigate = useNavigate();
    const { token, setToken } = useAuth();

    useEffect(() => {
        const fetchToken = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');

            if (!code || !state) {
                alert('Authorization code not found!');
                navigate('/');
                return;
            }

            try {
                const tokenUrl = `${config.authUrl}/oauth2/token`;
                const response = await axios.post(tokenUrl, { code, state }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = response.data;

                if (!data?.id_token) {
                    const errorMessage = data?.message || 'Error while receiving credentials.';
                    alert(errorMessage);
                    navigate('/');
                    return;
                }

                setToken(data.id_token);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'An error occurred while fetching the token.';
                console.error(error);
                alert(errorMessage);
                navigate('/');
            }
        };

        fetchToken();
    }, [navigate, setToken]);

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    return (
        <div className='flex items-center justify-center w-full h-full'>
            <Spinner size="lg" color='primary' />
        </div>
    );
};

export default OAuth2Callback;
