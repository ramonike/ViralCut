import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../ui/button';

export function GoogleAuthButton({ onLoginSuccess, onLoginError }) {
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log('Login Success:', tokenResponse);
            onLoginSuccess(tokenResponse);
        },
        onError: (error) => {
            console.error('Login Failed:', error);
            if (onLoginError) onLoginError(error);
        },
        scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
        flow: 'implicit', // Implicit flow for client-side only MVP
    });

    return (
        <Button onClick={() => login()} variant="secondary" className="w-full sm:w-auto">
            Conectar YouTube
        </Button>
    );
}
