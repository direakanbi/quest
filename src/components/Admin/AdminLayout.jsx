import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, CreditCard, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
    ];

    return (
        <div className="admin-layout" style={{ display: 'flex', height: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)', overflow: 'hidden' }}>
            <button
                className="mobile-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--accent-color)', color: 'var(--text-primary)', cursor: 'pointer', padding: '10px', borderRadius: '8px', display: 'none' }}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: -250 }}
                        animate={{ x: 0 }}
                        exit={{ x: -250 }}
                        className="admin-sidebar glass-panel"
                        style={{
                            width: '250px',
                            height: '100%',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRight: '1px solid rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '30px 20px',
                            zIndex: 50
                        }}
                    >
                        <div style={{ marginBottom: '50px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '10px', height: '10px', background: 'var(--accent-color)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-color)' }}></div>
                            <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '1.2rem', letterSpacing: '2px', color: 'var(--text-primary)' }}>SYS_ADMIN</h2>
                        </div>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    style={({ isActive }) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        padding: '12px 15px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        color: isActive ? '#000' : 'var(--text-secondary)',
                                        background: isActive ? 'var(--accent-color)' : 'transparent',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        transition: 'all 0.3s',
                                        boxShadow: isActive ? '0 0 15px rgba(0, 240, 255, 0.3)' : 'none'
                                    })}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '12px 15px',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text-primary)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                marginTop: 'auto'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
                                e.currentTarget.style.borderColor = '#ff4444';
                                e.currentTarget.style.color = '#ff4444';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                        >
                            <LogOut size={20} />
                            <span>LOGOUT</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ flex: 1, overflowY: 'auto', padding: '40px', position: 'relative' }}>
                <Outlet />
            </div>

            <style>{`
        @media (max-width: 768px) {
          .mobile-toggle { display: block !important; }
          .admin-sidebar { position: fixed; }
        }
      `}</style>
        </div>
    );
};

export default AdminLayout;
