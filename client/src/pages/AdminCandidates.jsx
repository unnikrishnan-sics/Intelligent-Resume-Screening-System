import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

const AdminCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const { data } = await api.get('/auth/candidates');
                setCandidates(data);
            } catch (error) {
                console.error("Failed to fetch candidates", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Candidates Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>View registered candidates</p>
                </header>

                <div className="card">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b' }}>Name</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b' }}>Email</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b' }}>Phone</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b' }}>Joined</th>
                                    <th style={{ textAlign: 'right', padding: '1rem', color: '#64748b' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map(candidate => (
                                    <tr key={candidate._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{candidate.name}</td>
                                        <td style={{ padding: '1rem' }}>{candidate.email}</td>
                                        <td style={{ padding: '1rem' }}>{candidate.phone || '-'}</td>
                                        <td style={{ padding: '1rem', color: '#64748b' }}>{new Date(candidate.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <Link to={`/candidates/${candidate._id}`} className="btn btn-outline btn-sm" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                                View Profile
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {candidates.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No candidates found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminCandidates;
