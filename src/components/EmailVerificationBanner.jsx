import React, { useState } from 'react';
import { API_ENDPOINTS, API_URL } from '../config/api';

const EmailVerificationBanner = ({ userEmail }) => {
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState('');
    const [isDismissed, setIsDismissed] = useState(false);

    if (isDismissed) return null;

    const handleResend = async () => {
        setIsResending(true);
        setMessage('');

        try {
            const response = await fetch(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email: userEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('✓ Email de verificação enviado! Verifique sua caixa de entrada.');
            } else {
                setMessage('✕ ' + (data.error || 'Erro ao enviar email.'));
            }
        } catch (error) {
            setMessage('✕ Erro ao enviar email. Tente novamente.');
            console.error(error);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="email-verification-banner">
            <div className="banner-content">
                <div className="banner-icon">📧</div>
                <div className="banner-text">
                    <strong>Email não verificado</strong>
                    <p>Por favor, verifique seu email para ter acesso completo.</p>
                </div>
                <div className="banner-actions">
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="resend-btn"
                    >
                        {isResending ? 'Enviando...' : 'Reenviar Email'}
                    </button>
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="dismiss-btn"
                    >
                        ✕
                    </button>
                </div>
            </div>
            {message && (
                <div className={`banner-message ${message.startsWith('✓') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <style jsx>{`
        .email-verification-banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .banner-icon {
          font-size: 2rem;
        }

        .banner-text {
          flex: 1;
        }

        .banner-text strong {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 1.1rem;
        }

        .banner-text p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .banner-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .resend-btn {
          background: white;
          color: #667eea;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .resend-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .resend-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dismiss-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .dismiss-btn:hover {
          opacity: 1;
        }

        .banner-message {
          margin-top: 0.75rem;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .banner-message.success {
          background: rgba(255, 255, 255, 0.2);
        }

        .banner-message.error {
          background: rgba(255, 0, 0, 0.2);
        }
      `}</style>
        </div>
    );
};

export default EmailVerificationBanner;
