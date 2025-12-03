import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../ui/button';

export function GoogleAuthButton({ onLoginSuccess, onLoginError, text = "Conectar YouTube", className, variant = "secondary" }) {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    console.log('[GoogleAuthButton] Client ID:', clientId ? 'CONFIGURED' : 'MISSING');

    // Validação do Client ID
    if (!clientId) {
        return (
            <div className="text-red-400 text-sm p-4 bg-red-900/20 rounded border border-red-500/30">
                ⚠️ <strong>Client ID não configurado.</strong><br />
                Adicione a variável <code className="bg-black/30 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> no arquivo <code className="bg-black/30 px-1 rounded">.env</code>
            </div>
        );
    }

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log('[GoogleAuthButton] Login Success:', tokenResponse);
            console.log('[GoogleAuthButton] Access Token:', tokenResponse.access_token ? 'EXISTS' : 'MISSING');
            console.log('[GoogleAuthButton] Expires In:', tokenResponse.expires_in);
            onLoginSuccess(tokenResponse);
        },
        onError: (error) => {
            console.error('[GoogleAuthButton] Login Failed:', error);
            if (onLoginError) {
                onLoginError(error);
            } else {
                alert('Erro ao fazer login com Google: ' + (error.error_description || error.error || 'Erro desconhecido'));
            }
        },
        scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
        flow: 'implicit', // Implicit flow for client-side only MVP
    });

    return (
        <Button
            onClick={() => {
                console.log('[GoogleAuthButton] Login button clicked');
                login();
            }}
            variant={variant}
            className={`w-full sm:w-auto ${className || ''}`}
        >
            {text}
        </Button>
    );
}
