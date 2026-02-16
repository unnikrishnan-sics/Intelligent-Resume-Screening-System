import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const CandidateDashboard = () => {
    const { user, updateUser } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes] = await Promise.all([
                    api.get('/resumes/my-resumes').catch(err => { console.error("Apps fetch failed", err); return { data: [] }; })
                ]);

                setApplications(appsRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to get relative time
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        return Math.floor(seconds / 3600) + "h";
    };

    const handleDeleteResume = async () => {
        if (window.confirm('Are you sure you want to remove your master resume?')) {
            try {
                await api.delete('/resumes/profile');
                toast.success('Master resume removed');
                // Manually update context since backend just returns message
                updateUser({
                    ...user,
                    resume: null,
                    resumeOriginalName: null
                });
            } catch (err) {
                toast.error('Delete failed');
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <Navbar />

            <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>

                    {/* Hero Section */}
                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Welcome back, {(user?.name || 'User').split(' ')[0]}! 👋</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                            Ready to take the next step in your career? Track your applications and explore new opportunities.
                        </p>
                    </header>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <div className="animate-float" style={{ fontSize: '2rem' }}>✨</div>
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your dashboard...</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                            {/* Section 2: Master Resume Management */}
                            <div>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Master Resume</h2>
                                <div className="card" style={{ padding: '2rem', border: '2px dashed #e2e8f0', backgroundColor: 'white' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
                                        <div>
                                            <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                                {user?.resumeOriginalName || 'No master resume uploaded'}
                                            </p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                Keep your primary resume updated for one-click applications.
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <input
                                                type="file"
                                                id="master-resume-input"
                                                hidden
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;
                                                    const formData = new FormData();
                                                    formData.append('resume', file);
                                                    try {
                                                        const res = await api.post('/resumes/profile', formData, {
                                                            headers: {
                                                                'Content-Type': 'multipart/form-data'
                                                            }
                                                        });
                                                        toast.success('Master resume updated successfully!');
                                                        // Update context state
                                                        updateUser(res.data);
                                                    } catch (err) {
                                                        toast.error('Upload failed: ' + (err.response?.data?.message || err.message));
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={() => document.getElementById('master-resume-input').click()}
                                                className="btn btn-primary"
                                            >
                                                {user?.resume ? 'Update Resume' : 'Upload Resume'}
                                            </button>
                                            {user?.resume && (
                                                <button onClick={handleDeleteResume} className="btn btn-outline-danger">
                                                    Remove Resume
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Recent Applications */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Recent Applications</h2>
                                    <Link to="/applications" className="btn btn-sm btn-outline">View All Applications &rarr;</Link>
                                </div>

                                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
                                    {applications.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📝</div>
                                            <p style={{ fontSize: '1.1rem' }}>No applications yet.</p>
                                            <p style={{ fontSize: '0.9rem' }}>Start applying to seeing your status here!</p>
                                            <Link to="/jobs" style={{ marginTop: '1rem', display: 'inline-block', color: 'var(--primary)', fontWeight: '600' }}>Explore Jobs</Link>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                                            {applications.slice(0, 3).map(app => {
                                                const threshold = app.job?.passingThreshold ?? 60;
                                                const isPassed = app.similarityScore >= threshold;
                                                return (
                                                    <div key={app._id} style={{ padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                                                        <div style={{ marginBottom: '0.5rem' }}>
                                                            <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                                                {app.job?.title || 'Unknown Job'}
                                                            </div>
                                                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                                                {app.job?.department}
                                                            </div>
                                                        </div>
                                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
                                                            <span style={{
                                                                fontSize: '0.8rem',
                                                                fontWeight: '600',
                                                                padding: '0.2rem 0.6rem',
                                                                borderRadius: '999px',
                                                                backgroundColor: isPassed ? '#dcfce7' : '#fee2e2',
                                                                color: isPassed ? '#16a34a' : '#ef4444'
                                                            }}>
                                                                {isPassed ? 'Shortlisted' : 'Reviewed'}
                                                            </span>
                                                            <Link to={`/my-applications/${app._id}`} style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none' }}>
                                                                View Analysis &rarr;
                                                            </Link>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CandidateDashboard;
