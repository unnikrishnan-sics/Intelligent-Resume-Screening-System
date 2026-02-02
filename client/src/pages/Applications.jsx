import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get('/resumes/my-resumes');
                setApplications(data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusBadge = (app) => {
        const threshold = app.job?.passingThreshold ?? 60;
        const isPassed = app.similarityScore >= threshold;
        return (
            <span style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                padding: '0.2rem 0.8rem',
                borderRadius: '999px',
                backgroundColor: isPassed ? '#dcfce7' : '#fee2e2',
                color: isPassed ? '#16a34a' : '#ef4444',
                display: 'inline-block'
            }}>
                {isPassed ? 'Shortlisted' : 'Reviewed'}
            </span>
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <Navbar />
            <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>

                    <header style={{ marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Applications</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Track the status of all your job applications.</p>
                    </header>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <div className="animate-float" style={{ fontSize: '2rem' }}>✨</div>
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading applications...</p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                            <h3>No applications yet</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't applied to any jobs yet.</p>
                            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {applications.map(app => (
                                <div key={app._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: '1 1 300px' }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                                            {app.job?.title || 'Unknown Job'}
                                        </h3>
                                        <p style={{ color: '#475569', marginBottom: '0.25rem' }}>{app.job?.department}</p>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        {getStatusBadge(app)}
                                        <Link to={`/my-applications/${app._id}`} className="btn btn-sm btn-outline">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Applications;
