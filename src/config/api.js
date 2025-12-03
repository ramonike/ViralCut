// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    AUTH: {
        SIGN_UP: '/api/auth/sign-up',
        SIGN_IN: '/api/auth/sign-in',
        SIGN_OUT: '/api/auth/sign-out',
        SESSION: '/api/auth/session',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        RESET_PASSWORD: '/api/auth/reset-password',
        VERIFY_EMAIL: '/api/auth/verify-email',
        RESEND_VERIFICATION: '/api/auth/resend-verification',
    },
    ADMIN: {
        USERS: '/api/admin/users',
    }
};
