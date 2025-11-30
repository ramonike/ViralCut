import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS, API_URL } from '../../config/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token de verificação não encontrado.');
            return;
        }

        // Verify email
        fetch(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setStatus('success');
                    setMessage('Email verificado com sucesso!');
                    // Redirect to login after 3 seconds
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Falha na verificação do email.');
                }
            })
            .catch((err) => {
                setStatus('error');
                setMessage('Erro ao verificar email. Tente novamente.');
                console.error(err);
            });
    }, [token, navigate]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Verificação de Email</h1>
                </div>

                <div className="verification-status">
                    {status === 'verifying' && (
                        <div className="status-verifying">
                            <div className="spinner"></div>
                            <p>Verificando seu email...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="status-success">
                            <div className="success-icon">✓</div>
                            <h2>Email Verificado!</h2>
                            <p>{message}</p>
                            <p className="redirect-message">Redirecionando para o login...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="status-error">
                            <div className="error-icon">✕</div>
                            <h2>Erro na Verificação</h2>
                            <p>{message}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-primary"
                            >
                                Voltar para o Login
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .verification-status {
          text-align: center;
          padding: 2rem 0;
        }

        .status-verifying,
        .status-success,
        .status-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .success-icon,
        .error-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          font-weight: bold;
        }

        .success-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .error-icon {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        .redirect-message {
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .btn-primary {
          margin-top: 1rem;
        }
      `}</style>
        </div>
    );
};

export default VerifyEmailPage;
