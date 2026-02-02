import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const RecruiterDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({ active: 0, totalApplicants: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const { data } = await api.get('/jobs/my-jobs');
                setJobs(data);

                // Calculate stats
                const activeCount = data.filter(j => j.status === 'active').length;
                // Note: To get total applicants we'd need to fetch them or include count in job aggregation
                // For now, let's just count active jobs
                setStats(prev => ({ ...prev, active: activeCount }));

                // Fetch total applicants count if possible, or iterate
                // Optimization: Backend should ideally provide this. 
                // Let's mock or fetch individually if needed, or skip for now to keep it fast.
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyJobs();
    }, []);

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
        try {
            await api.delete(`/jobs/${id}`);
            setJobs(jobs.filter(job => job._id !== id));
            // Recalculate stats
            setStats(prev => ({ ...prev, active: jobs.find(j => j._id === id)?.status === 'active' ? prev.active - 1 : prev.active }));
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
            setStats(prev => ({ ...prev, active: newStatus === 'active' ? prev.active + 1 : prev.active - 1 }));
        } catch (error) {
            console.error("Failed to update status", error);
            alert('Failed to update status');
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem' }}>Recruiter Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your job postings and applicants</p>
                    </div>
                    <Link to="/create-job" className="btn btn-primary">
                        + Post New Job
                    </Link>
                </header>

                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Active Jobs</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1 }}>{stats.active}</p>
                    </div>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Jobs</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1 }}>{jobs.length}</p>
                    </div>
                </div>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>Recent Job Postings</h3>
                    </div>

                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                    ) : jobs.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <p>No jobs posted yet.</p>
                            <Link to="/create-job" style={{ color: 'var(--primary)', fontWeight: '500' }}>Create your first job</Link>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Job Title</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Posted Date</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Threshold</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map(job => (
                                        <tr key={job._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: '600' }}>{job.title}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.location} • {job.type}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: job.status === 'active' ? '#dcfce7' : '#f1f5f9',
                                                    color: job.status === 'active' ? '#166534' : '#64748b',
                                                    cursor: 'pointer'
                                                }} onClick={() => handleToggleStatus(job)}>
                                                    {job.status === 'active' ? 'Active' : 'Closed'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                                {job.passingThreshold ?? 60}%
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <Link to={`/jobs/${job._id}/applicants`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                                        Applicants
                                                    </Link>
                                                    <Link to={`/jobs/${job._id}/edit`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                                        Edit
                                                    </Link>
                                                    {/* For now, just Delete and Toggle are critical */}
                                                    <button
                                                        onClick={() => handleDeleteJob(job._id)}
                                                        style={{
                                                            padding: '0.4rem 0.8rem',
                                                            fontSize: '0.8rem',
                                                            background: 'transparent',
                                                            border: '1px solid #ef4444',
                                                            color: '#ef4444',
                                                            borderRadius: '9999px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RecruiterDashboard;
