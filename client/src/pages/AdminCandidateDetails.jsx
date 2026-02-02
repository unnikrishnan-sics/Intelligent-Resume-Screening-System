import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const AdminCandidateDetails = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await api.get(`/auth/candidate/${id}`);
                setProfile(data);
                // Set initial resume if available
                if (data.applications && data.applications.length > 0) {
                    const latestResume = data.applications[0];
                    setSelectedResumeUrl(`http://localhost:5000/${latestResume.filePath.replace(/\\/g, '/')}`);
                }
            } catch (error) {
                console.error("Failed to fetch candidate details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleViewResume = (filePath) => {
        setSelectedResumeUrl(`http://localhost:5000/${filePath.replace(/\\/g, '/')}`);
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="dashboard-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    Loading...
                </main>
            </div>
        );
    }

    if (!profile || !profile.user) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="dashboard-main">
                    <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                        Candidate not found.
                        <Link to="/admin/candidates" style={{ display: 'block', marginTop: '1rem', color: 'var(--primary)' }}>Back to Candidates</Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link to="/candidates" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                        <span>&larr;</span> Back to Candidates
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    {/* Left Column: Profile & Applications */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Profile Card */}
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {profile.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{profile.user.name}</h2>
                                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Candidate</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <div>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Email:</span>
                                    <div style={{ fontWeight: '500' }}>{profile.user.email}</div>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Phone:</span>
                                    <div style={{ fontWeight: '500' }}>{profile.user.phone || 'N/A'}</div>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Joined:</span>
                                    <div style={{ fontWeight: '500' }}>{new Date(profile.user.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Applications List */}
                        <div className="card">
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Application History ({profile.applications.length})</h3>
                            {profile.applications.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>No job applications found.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {profile.applications.map(app => (
                                        <div key={app._id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: '#f8fafc' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: '600', color: '#1e293b' }}>{app.job.title}</span>
                                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(app.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.5rem' }}>
                                                {app.job.department} • {app.job.location}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', background: app.classification === 'Highly Suitable' ? '#dcfce7' : '#fee2e2', color: app.classification === 'Highly Suitable' ? '#166534' : '#991b1b' }}>
                                                    {app.classification}
                                                </span>
                                                <button
                                                    onClick={() => handleViewResume(app.filePath)}
                                                    style={{ fontSize: '0.85rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                                >
                                                    View Resume
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Resume Viewer */}
                    <div className="card" style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: '#334155' }}>Resume Preview</h3>
                            {selectedResumeUrl && (
                                <a href={selectedResumeUrl} download target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                                    Download
                                </a>
                            )}
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
                            {selectedResumeUrl ? (
                                <iframe
                                    src={selectedResumeUrl}
                                    title="Resume Viewer"
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                                    Select an application to view resume
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminCandidateDetails;
