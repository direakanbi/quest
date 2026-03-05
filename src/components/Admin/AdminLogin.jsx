import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('/admin/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="admin-login-container" style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'var(--bg-color)',
            color: 'var(--text-primary)'
        }}>
            <motion.div
                className="login-box glass-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '40px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 0 30px rgba(0, 240, 255, 0.1)'
                }}
            >
                <h2 style={{ fontFamily: 'var(--font-heading)', textAlign: 'center', marginBottom: '30px', color: 'var(--accent-color)' }}>
                    ADMIN ACCESS
                </h2>

                {error && <p style={{ color: '#ff4444', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Operator Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                            style={{
                                background: 'rgba(0,0,0,0.5)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '12px',
                                color: 'white',
                                outline: 'none',
                                borderRadius: '8px',
                                transition: 'border-color 0.3s'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Passcode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                            style={{
                                background: 'rgba(0,0,0,0.5)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '12px',
                                color: 'white',
                                outline: 'none',
                                borderRadius: '8px',
                                transition: 'border-color 0.3s'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '15px',
                            background: 'var(--accent-color)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '10px',
                            transition: 'all 0.3s'
                        }}
                    >
                        {loading ? 'AUTHENTICATING...' : 'AUTHORIZE'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
