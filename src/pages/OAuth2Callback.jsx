import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import config from '../configs/config'

const OAuth2Callback = () => {
    const navigate = useNavigate();
    const {token, setToken} = useAuth();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const data = {
            'code': urlParams.get('code'),
            'state': urlParams.get('state')
        }

        if (!data.code || !data.state) {
            alert('Authorization code not found!');
            return;
        }
        try {
            const response = fetch(`${config.authUrl}/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            const data = response.json();
            
            if (!data?.idToken) {
                alert('Error while receiving credentials.');
                navigate('/');
                return;
            }

            setToken(data.idToken);
        } catch (error) {
            alert('Error exchanging authorization code for tokens.');
            console.error(error);
        }
    },[])

    useEffect(() => {
        if (!token) return;
        navigate('/');
    },[token])

    return (
        <div></div>
    )
}

export default OAuth2Callback