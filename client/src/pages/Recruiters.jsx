import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const Recruiters = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const fetchRecruiters = async () => {
        try {
            // In a real app, we might have a specific endpoint for fetching users by role
            // For now, assuming /auth/pending returns pending ones, but we might need all.
            // Let's rely on the pending endpoint to show approvals first.
            const { data } = await api.get('/auth/pending');
            setRecruiters(data);
        } catch (error) {
            console.error("Failed to fetch recruiters", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/auth/approve/${id}`);
            // Refresh list
            fetchRecruiters();
            alert('Recruiter Approved!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to approve');
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Recruiter Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Approve and manage recruiter accounts</p>
                </header>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>Pending Approvals</h3>

                    {loading ? (
                        <p>Loading...</p>
                    ) : recruiters.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>No pending recruiter requests.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Requested On</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recruiters.map(user => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleApprove(user._id)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                            >
                                                Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Recruiters;
