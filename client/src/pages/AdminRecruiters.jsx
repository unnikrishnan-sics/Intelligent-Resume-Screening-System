import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const AdminRecruiters = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('approved'); // 'approved' or 'pending'
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const fetchRecruiters = async () => {
        try {
            const { data } = await api.get('/auth/recruiters');
            setRecruiters(data);
        } catch (error) {
            console.error("Failed to fetch recruiters", error);
        } finally {
            setLoading(false);
        }
    };

    const approveUser = async (id) => {
        try {
            await api.put(`/auth/approve/${id}`);
            setMessage('Recruiter approved successfully');
            fetchRecruiters(); // Refresh list
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error approving recruiter');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const deactivateUser = async (id) => {
        if (!window.confirm("Are you sure you want to deactivate this recruiter? They will lose access immediately.")) return;
        try {
            await api.put(`/auth/deactivate/${id}`);
            setMessage('Recruiter deactivated successfully');
            fetchRecruiters(); // Refresh list
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error deactivating recruiter');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const pendingRecruiters = recruiters.filter(r => !r.isApproved);
    const approvedRecruiters = recruiters.filter(r => r.isApproved);

    const displayList = activeTab === 'pending' ? pendingRecruiters : approvedRecruiters;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Recruiter Management</h1>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                        <button
                            onClick={() => setActiveTab('approved')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderBottom: activeTab === 'approved' ? '2px solid var(--primary)' : '2px solid transparent',
                                color: activeTab === 'approved' ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === 'approved' ? '600' : '400',
                                background: 'transparent',
                                border: 'none',
                                borderBottomWidth: '2px',
                                borderBottomStyle: 'solid',
                                borderBottomColor: activeTab === 'approved' ? 'var(--primary)' : 'transparent',
                                cursor: 'pointer'
                            }}
                        >
                            Approved ({approvedRecruiters.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderBottom: activeTab === 'pending' ? '2px solid #ef4444' : '2px solid transparent',
                                color: activeTab === 'pending' ? '#ef4444' : 'var(--text-muted)',
                                fontWeight: activeTab === 'pending' ? '600' : '400',
                                background: 'transparent',
                                border: 'none',
                                borderBottomWidth: '2px',
                                borderBottomStyle: 'solid',
                                borderBottomColor: activeTab === 'pending' ? '#ef4444' : 'transparent',
                                cursor: 'pointer'
                            }}
                        >
                            Pending Approval ({pendingRecruiters.length})
                        </button>
                    </div>
                </header>

                {message && <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', backgroundColor: '#dcfce7', color: '#166534' }}>{message}</div>}

                <div className="card">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b' }}>Name</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b' }}>Email</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b' }}>Status</th>
                                    <th style={{ textAlign: 'right', padding: '1rem', color: '#64748b' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayList.map(recruiter => (
                                    <tr key={recruiter._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{recruiter.name}</td>
                                        <td style={{ padding: '1rem' }}>{recruiter.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.85rem',
                                                backgroundColor: recruiter.isApproved ? '#dcfce7' : '#fee2e2',
                                                color: recruiter.isApproved ? '#166534' : '#991b1b'
                                            }}>
                                                {recruiter.isApproved ? 'Active' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            {!recruiter.isApproved ? (
                                                <button
                                                    onClick={() => approveUser(recruiter._id)}
                                                    className="btn btn-primary btn-sm"
                                                    style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
                                                >
                                                    Approve
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => deactivateUser(recruiter._id)}
                                                    className="btn btn-outline btn-sm"
                                                    style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', borderColor: '#ef4444', color: '#ef4444' }}
                                                >
                                                    Deactivate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {displayList.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                            {activeTab === 'pending' ? 'No pending approvals.' : 'No active recruiters found.'}
                                        </td>
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

export default AdminRecruiters;
