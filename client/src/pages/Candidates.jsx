import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            // We need a route for this: GET /api/auth/users?role=candidate
            // For now, let's assume we can add that or just show a placeholder if not ready.
            // But let's try to fetch all users and filter client side if API is generic, 
            // though standard practice is backend filter.
            // Based on authController, we have getPendingRecruiters, but not getCandidates.
            // So we'll stick to a nice placeholder or add the endpoint.
            // Let's add the endpoint!
            // But first, let's render the loading state.
            const { data } = await api.get('/auth/candidates');
            setCandidates(data);
        } catch (error) {
            console.error("Failed to fetch candidates", error);
            // Fallback for now if route doesn't exist
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Candidate Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>View registered candidates</p>
                </header>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>Registered Candidates</h3>

                    {loading ? (
                        <p>Loading...</p>
                    ) : candidates.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                            <h3>No candidates found</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Or API endpoint not yet implemented.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Joined On</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map(user => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>View Profile</button>
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

export default Candidates;
