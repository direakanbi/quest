import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Package, DollarSign, Activity, ArrowUpRight } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#111', border: '1px solid var(--accent-color)', padding: '10px 15px', borderRadius: '8px', color: '#fff' }}>
                <p style={{ margin: '0 0 5px 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{label}</p>
                <p style={{ margin: 0, color: 'var(--accent-color)', fontWeight: 'bold' }}>
                    ${payload[0].value.toFixed(2)}
                </p>
            </div>
        );
    }
    return null;
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        revenue: 0,
        orders: 0
    });
    const [revenueData, setRevenueData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);

            // Fetch product count
            const { count: productCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            // Fetch transactions
            const { data: txs } = await supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false });

            if (txs) {
                const totalRevenue = txs.reduce((acc, curr) => {
                    // Only count completed or pending perhaps? Let's count all or just Completed
                    if (curr.status !== 'Failed') {
                        return acc + Number(curr.amount);
                    }
                    return acc;
                }, 0);

                setStats({
                    products: productCount || 0,
                    revenue: totalRevenue,
                    orders: txs.length
                });

                // Get last 5 orders
                setRecentOrders(txs.slice(0, 5));

                // Generate last 7 days chart data
                const chartData = [];
                for (let i = 6; i >= 0; i--) {
                    const date = subDays(new Date(), i);
                    const dayRevenue = txs.reduce((acc, curr) => {
                        if (curr.status !== 'Failed' && isSameDay(new Date(curr.created_at), date)) {
                            return acc + Number(curr.amount);
                        }
                        return acc;
                    }, 0);

                    chartData.push({
                        name: format(date, 'MMM dd'),
                        total: dayRevenue
                    });
                }
                setRevenueData(chartData);
            }

            setLoading(false);
        };

        fetchDashboardData();
    }, []);


    return (
        <div style={{ paddingBottom: '40px' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-color)', fontSize: '2.5rem', margin: 0 }}>DASHBOARD</h1>
                <p style={{ color: 'var(--text-secondary)' }}>System overview and metrics.</p>
            </header>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>Total Revenue</h3>
                            <p style={{ color: 'var(--text-primary)', fontSize: '2rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                                ${loading ? '...' : stats.revenue.toFixed(2)}
                            </p>
                        </div>
                        <DollarSign color="var(--accent-color)" size={24} />
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>Total Orders</h3>
                            <p style={{ color: 'var(--text-primary)', fontSize: '2rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                                {loading ? '...' : stats.orders}
                            </p>
                        </div>
                        <Activity color="var(--accent-color)" size={24} />
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>Active Products</h3>
                            <p style={{ color: 'var(--text-primary)', fontSize: '2rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                                {loading ? '...' : stats.products}
                            </p>
                        </div>
                        <Package color="var(--accent-color)" size={24} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {/* Revenue Chart */}
                <div style={{ ...cardStyle, gridColumn: '1 / -1', height: '400px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '20px', marginTop: 0 }}>Revenue (Last 7 Days)</h3>
                    {loading ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart data...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                <Bar dataKey="total" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Recent Orders */}
                <div style={{ ...cardStyle }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>Recent Orders</h3>
                        <ArrowUpRight size={20} color="var(--text-secondary)" />
                    </div>
                    {loading ? (
                        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>Loading orders...</div>
                    ) : recentOrders.length === 0 ? (
                        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No orders yet.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {recentOrders.map(order => (
                                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <p style={{ margin: '0 0 5px 0', color: 'var(--text-primary)', fontWeight: 'bold' }}>{order.client_email}</p>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                            {format(new Date(order.created_at), 'MMM dd, yyyy - h:mm a')}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: '0 0 5px 0', color: 'var(--accent-color)', fontWeight: 'bold' }}>${order.amount}</p>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            background: order.status === 'Completed' ? 'rgba(0,255,100,0.1)' :
                                                order.status === 'Failed' ? 'rgba(255,0,0,0.1)' : 'rgba(255,200,0,0.1)',
                                            color: order.status === 'Completed' ? '#00ff64' :
                                                order.status === 'Failed' ? '#ff4444' : '#ffc800',
                                        }}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '30px',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column'
};

export default AdminDashboard;
