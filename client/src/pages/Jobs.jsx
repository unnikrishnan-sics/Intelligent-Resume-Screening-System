import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]); // Store user applications
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    // Refresh trigger
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                let endpoint = '/jobs';
                if (user?.role === 'recruiter') {
                    endpoint = '/jobs/my-jobs';
                }

                // Fetch jobs and applications in parallel if candidate
                const promises = [api.get(endpoint)];
                if (user?.role === 'candidate') {
                    promises.push(api.get('/resumes/my-resumes').catch(err => ({ data: [] })));
                }

                const [jobsRes, appsRes] = await Promise.all(promises);

                setJobs(jobsRes.data);
                if (appsRes) {
                    setApplications(appsRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [user, refresh]);

    // ... existing handlers ...
    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
        try {
            await api.delete(`/jobs/${id}`);
            setJobs(jobs.filter(job => job._id !== id));
        } catch (error) {
            console.error("Failed to delete job", error);
            alert('Failed to delete job');
        }
    };

    const handleToggleStatus = async (job) => {
        const newStatus = job.status === 'active' ? 'closed' : 'active';
        try {
            await api.put(`/jobs/${job._id}`, { status: newStatus });
            setJobs(jobs.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
        } catch (error) {
            console.error("Failed to update status", error);
            alert('Failed to update status');
        }
    };

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
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const isOwner = (job) => {
        if (!user) return false;
        if (user.isAdmin) return true;
        return job.user === user.id || job.user?._id === user.id;
    };

    // Check if job is applied
    const isApplied = (jobId) => {
        return applications.some(app => app.job && (app.job._id === jobId || app.job === jobId));
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Job Listings</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage and view open positions</p>
                    </div>
                    {(user?.role === 'recruiter' || user?.isAdmin) && (
                        <Link to="/create-job" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>+</span> Post New Job
                        </Link>
                    )}
                </header>

                {loading ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Loading jobs...</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {jobs.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                                <h3>No jobs posted yet</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Get started by creating your first job post.</p>
                            </div>
                        ) : (
                            jobs.map(job => (
                                <div key={job._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{job.title}</h3>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                            <span>🏢 {job.department}</span>
                                            <span>📍 {job.location}</span>
                                            <span>🕒 {job.type}</span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                            Posted {timeAgo(job.createdAt)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {/* Status Badge - Clickable for toggle if owner */}
                                        <span
                                            className={`badge`}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                background: job.status === 'active' ? '#dcfce7' : '#f1f5f9',
                                                color: job.status === 'active' ? '#166534' : '#475569',
                                                fontSize: '0.85rem',
                                                fontWeight: '500',
                                                cursor: isOwner(job) ? 'pointer' : 'default',
                                                userSelect: 'none'
                                            }}
                                            onClick={(e) => {
                                                if (isOwner(job)) {
                                                    e.stopPropagation();
                                                    handleToggleStatus(job);
                                                }
                                            }}
                                            title={isOwner(job) ? "Click to toggle status" : ""}
                                        >
                                            {job.status === 'active' ? 'Active' : 'Closed'}
                                        </span>

                                        {(!user || user.role === 'candidate') && job.status === 'active' && (
                                            isApplied(job._id) ? (
                                                <button disabled className="btn" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', marginLeft: '0.5rem', backgroundColor: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed', border: '1px solid #cbd5e1' }}>
                                                    Applied
                                                </button>
                                            ) : (
                                                <Link
                                                    to={`/jobs/${job._id}/apply`}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', marginLeft: '0.5rem' }}
                                                >
                                                    Apply Now
                                                </Link>
                                            )
                                        )}


                                        {isOwner(job) && (
                                            <>
                                                <Link
                                                    to={`/jobs/${job._id}/applicants`}
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', marginLeft: '0.5rem' }}
                                                >
                                                    View Applicants
                                                </Link>
                                                <Link
                                                    to={`/jobs/${job._id}/edit`}
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', marginLeft: '0.5rem' }}
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteJob(job._id)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        fontSize: '0.9rem',
                                                        marginLeft: '0.5rem',
                                                        color: '#ef4444',
                                                        border: '1px solid #ef4444',
                                                        background: 'transparent',
                                                        borderRadius: '999px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Jobs;
