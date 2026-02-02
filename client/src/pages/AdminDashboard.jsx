import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        candidates: 0,
        recruiters: 0,
        jobs: 0,
        applications: 0,
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/auth/stats');
                setStats(data);
            } catch (error) {
                console.error('Error fetching admin stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-main">
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Platform Analytics & Activities</p>
                </header>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Candidates</span>
                        <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', marginTop: '0.5rem' }}>{stats.candidates}</span>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Recruiters</span>
                        <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6', marginTop: '0.5rem' }}>{stats.recruiters}</span>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Active Jobs</span>
                        <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginTop: '0.5rem' }}>{stats.jobs}</span>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Total Applications</span>
                        <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b', marginTop: '0.5rem' }}>{stats.applications}</span>
                    </div>
                </div>

                {/* Analytics Chart */}
                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1e293b' }}>Top Jobs by Applications</h2>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                                />
                                <Area type="monotone" dataKey="applications" stroke="#6366f1" fillOpacity={1} fill="url(#colorApps)" name="Applications" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;
