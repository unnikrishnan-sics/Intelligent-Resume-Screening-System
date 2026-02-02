import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const BrowseJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Parallel fetch for jobs and applications
                const promises = [api.get('/jobs')];
                if (user?.role === 'candidate') {
                    promises.push(api.get('/resumes/my-resumes').catch(err => ({ data: [] })));
                }

                const [jobsRes, appsRes] = await Promise.all(promises);

                // Filter active
                setJobs(jobsRes.data.filter(j => j.status === 'active'));

                if (appsRes) {
                    setApplications(appsRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [user]);

    // Helper to get relative time
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    const isApplied = (jobId) => {
        return applications.some(app => app.job && (app.job._id === jobId || app.job === jobId));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <Navbar />
            <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>

                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Find Your Dream Job</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                            Explore opportunities that match your skills and aspirations.
                        </p>
                    </header>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <div className="animate-float" style={{ fontSize: '2rem' }}>✨</div>
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading jobs...</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                            <h3>No open positions right now</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Check back later for new opportunities.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                            {jobs.map(job => (
                                <div key={job._id} className="card" style={{
                                    padding: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.2s',
                                    border: '1px solid #e2e8f0',
                                    height: '100%'
                                }}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary)', lineHeight: 1.3 }}>{job.title}</h3>
                                        </div>
                                        <p style={{ fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>{job.department}</p>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            <span>📍 {job.location}</span>
                                            <span>🕒 {job.type}</span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Posted {timeAgo(job.createdAt)}</span>
                                        {isApplied(job._id) ? (
                                            <button disabled className="btn" style={{ padding: '0.6rem 1.5rem', backgroundColor: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed', border: '1px solid #cbd5e1' }}>
                                                Applied
                                            </button>
                                        ) : (
                                            <Link
                                                to={`/jobs/${job._id}/apply`}
                                                className="btn btn-primary"
                                                style={{ padding: '0.6rem 1.5rem' }}
                                            >
                                                Apply Now
                                            </Link>
                                        )}
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

export default BrowseJobs;
