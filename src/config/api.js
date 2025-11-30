// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    AUTH: {
        SIGN_UP: `${API_URL}/api/auth/sign-up`,
        SIGN_IN: `${API_URL}/api/auth/sign-in`,
        SIGN_OUT: `${API_URL}/api/auth/sign-out`,
        SESSION: `${API_URL}/api/auth/session`,
        FORGOT_PASSWORD: `${API_URL}/api/auth/forgot-password`,
        RESET_PASSWORD: `${API_URL}/api/auth/reset-password`,
        VERIFY_EMAIL: `${API_URL}/api/auth/verify-email`,
        RESEND_VERIFICATION: `${API_URL}/api/auth/resend-verification`,
    },
    HEALTH: {
        PING: `${API_URL}/ping`,
        TEST_DB: `${API_URL}/test-db`,
    }
};
