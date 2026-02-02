import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CandidateDashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]); // For displaying recent jobs
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetch
                const [appsRes, jobsRes] = await Promise.all([
                    api.get('/resumes/my-resumes').catch(err => { console.error("Apps fetch failed", err); return { data: [] }; }),
                    api.get('/jobs').catch(err => { console.error("Jobs fetch failed", err); return { data: [] }; })
                ]);

                setApplications(appsRes.data);

                // Sort jobs by date and take recent 3
                const sortedJobs = jobsRes.data
                    .filter(j => j.status === 'active')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);

                setJobs(sortedJobs);
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <Navbar />

            <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>

                    {/* Hero Section */}
                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
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

                            {/* Section 1: Recommended Jobs */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Recommended Jobs</h2>
                                    <Link to="/jobs" className="btn btn-sm btn-outline">View All Jobs &rarr;</Link>
                                </div>

                                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                                    {jobs.length > 0 ? (
                                        jobs.map(job => (
                                            <div key={job._id} className="card" style={{ padding: '1.5rem', transition: 'transform 0.2s', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                <div style={{ marginBottom: '1rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                        <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--primary)' }}>{job.title}</h3>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{timeAgo(job.createdAt)} ago</span>
                                                    </div>
                                                    <p style={{ fontWeight: '500', color: '#334155' }}>{job.department}</p>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>📍 {job.location} • {job.type}</p>
                                                </div>
                                                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Match your profile?</span>
                                                    {applications.some(app => app.job && app.job._id === job._id) ? (
                                                        <button disabled className="btn btn-sm" style={{ backgroundColor: '#e2e8f0', color: '#64748b', cursor: 'not-allowed', border: 'none' }}>Applied</button>
                                                    ) : (
                                                        <Link to={`/jobs/${job._id}/apply`} className="btn btn-sm btn-primary">Apply Now</Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="card" style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
                                            <p style={{ color: 'var(--text-muted)' }}>No active jobs found at the moment.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 2: Recent Applications */}
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
                                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                                                View Details
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
