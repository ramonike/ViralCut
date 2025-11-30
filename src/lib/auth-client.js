import { createAuthClient } from "better-auth/react";
import { API_ENDPOINTS, API_URL } from '../config/api';

export const authClient = createAuthClient({
    baseURL: API_URL
});
