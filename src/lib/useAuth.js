import { useEffect, useState } from "react";

export function useAuth() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);

    // Temporarily disable session check
    // TODO: Implement proper session management
    useEffect(() => {
        // For now, assume user is always logged in
        setSession({ user: { email: "user@example.com" } });
        setLoading(false);
    }, []);

    return { session, loading };
}
