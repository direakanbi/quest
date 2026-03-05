import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const ProtectedRoute = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-color)' }}>
                <p style={{ color: 'var(--accent-color)', fontFamily: 'var(--font-heading)', letterSpacing: '2px' }}>VERIFYING ACCESS...</p>
            </div>
        );
    }

    // If there is no session, redirect to the login page
    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }

    // If there is a session, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
