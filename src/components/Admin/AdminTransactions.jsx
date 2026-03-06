import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });

        if (error) {
            if (error.code === '42P01') {
                setError('Table "transactions" does not exist in Supabase. Please create it via SQL Editor with columns: id (uuid default gen_random_uuid()), client_email (text), amount (numeric), status (text), created_at (timestampz default now()).');
            } else {
                setError(error.message);
            }
        } else {
            setTransactions(data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTransactions();
    }, [fetchTransactions]);

    const updateStatus = async (id, newStatus) => {
        const { error } = await supabase.from('transactions').update({ status: newStatus }).eq('id', id);
        if (error) alert(error.message);
        else fetchTransactions();
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-color)', fontSize: '2.5rem', margin: 0 }}>TRANSACTIONS</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>View client payments and orders</p>
                </div>
                <button
                    onClick={fetchTransactions}
                    style={{ padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
                >
                    <RefreshCw size={20} className={loading ? "spin" : ""} />
                </button>
            </header>

            {error ? (
                <div style={{ padding: '20px', background: 'rgba(255,0,0,0.1)', border: '1px solid red', borderRadius: '8px', color: '#ff4444' }}>
                    {error}
                </div>
            ) : (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <tr>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem' }}>Order ID</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem' }}>Client Email</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem' }}>Amount</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem' }}>Status</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found.</td></tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px 20px', color: 'var(--text-primary)' }}>{tx.id.substring(0, 8)}...</td>
                                        <td style={{ padding: '15px 20px', color: 'var(--text-primary)' }}>{tx.client_email}</td>
                                        <td style={{ padding: '15px 20px', color: 'var(--accent-color)' }}>${tx.amount}</td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <select
                                                value={tx.status || 'Pending'}
                                                onChange={(e) => updateStatus(tx.id, e.target.value)}
                                                style={{
                                                    background: tx.status === 'Completed' ? 'rgba(0,255,100,0.1)' : 'rgba(255,200,0,0.1)',
                                                    color: tx.status === 'Completed' ? '#00ff64' : '#ffc800',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Failed">Failed</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>
                                            {format(new Date(tx.created_at), 'MMM dd, yyyy - h:mm a')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};

export default AdminTransactions;
