import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const JobApplicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [threshold, setThreshold] = useState(60);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobRes, applicantsRes] = await Promise.all([
                    api.get(`/jobs/${jobId}`),
                    api.get(`/resumes/job/${jobId}`)
                ]);
                setJob(jobRes.data);
                setThreshold(jobRes.data.passingThreshold ?? 60);
                setApplicants(applicantsRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [jobId]);

    const getStatus = (score) => {
        const pass = score >= threshold;
        return pass ? { label: 'Shortlisted', color: '#16a34a', bg: '#dcfce7' } : { label: 'Rejected', color: '#ef4444', bg: '#fee2e2' };
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <Link to="/recruiter-dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Applicants for {job?.title}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>AI-Ranked list regarding threshold: <strong>{threshold}%</strong></p>
                    </div>
                    {applicants.length > 0 && (
                        <a
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/resumes/job/${jobId}/export`}
                            download
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            onClick={(e) => {
                                // Since it's a direct link to the API, we need to handle token if not using cookies
                                // But usually for downloads, we might need a workaround if using Bearer token
                            }}
                        >
                            <span>📥</span> Export to CSV
                        </a>
                    )}
                </header>

                {loading ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Loading applicants...</p>
                    </div>
                ) : (
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        {applicants.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                                <h3>No applicants yet</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Waiting for candidates to apply.</p>
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Candidate</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>AI Score</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Classification</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map(app => {
                                        const status = getStatus(app.similarityScore);
                                        return (
                                            <tr key={app._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ fontWeight: '600' }}>{app.candidateName}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{app.email}</div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        fontWeight: '700',
                                                        // Score color independent of threshold or dependent?
                                                        // Let's keep score color absolute (green for high, red for low) but status relative
                                                        color: app.similarityScore >= 80 ? '#16a34a' : app.similarityScore >= 50 ? '#ca8a04' : '#dc2626'
                                                    }}>
                                                        <span style={{ fontSize: '1.25rem' }}>{Math.round(app.similarityScore)}%</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500',
                                                        backgroundColor: app.classification === 'Highly Suitable' ? '#dcfce7' :
                                                            app.classification === 'Moderately Suitable' ? '#fef9c3' : '#fee2e2',
                                                        color: app.classification === 'Highly Suitable' ? '#166534' :
                                                            app.classification === 'Moderately Suitable' ? '#854d0e' : '#991b1b'
                                                    }}>
                                                        {app.classification}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '500',
                                                        backgroundColor: status.bg,
                                                        color: status.color
                                                    }}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    <Link to={`/resumes/${app._id}`} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobApplicants;
