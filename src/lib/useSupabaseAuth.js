import { useEffect, useState } from 'react';
import { authClient } from './auth-client';

/**
 * Custom hook to get current user from Better Auth
 * Returns user ID for Supabase database operations
 */
export function useSupabaseAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await authClient.getSession();

                if (session?.user) {
                    // Use Better Auth user directly
                    // The user.id will be used as user_id in Supabase tables
                    setUser({
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.name
                    });
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    return { user, loading };
}
