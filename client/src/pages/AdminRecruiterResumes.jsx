import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const AdminRecruiterResumes = () => {
    const { recruiterId } = useParams();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const { data } = await api.get(`/resumes/recruiter/${recruiterId}`);
                setResumes(data);
            } catch (error) {
                console.error("Failed to fetch resumes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResumes();
    }, [recruiterId]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <Link to="/recruiters" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>&larr; Back to Recruiters</Link>
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Company Resumes</h1>
                    <p style={{ color: 'var(--text-muted)' }}>List of resumes applied to this company's jobs.</p>
                </header>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <p>Loading resumes...</p>
                        </div>
                    ) : resumes.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                            <h3>No resumes found</h3>
                            <p style={{ color: 'var(--text-muted)' }}>No candidates have applied to this recruiter's jobs yet.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', width: '80px' }}>NO</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>USERNAME</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>JOB TITLE</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>AI SCORE</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>RESUME</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resumes.map((resume, index) => (
                                    <tr key={resume._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: '600' }}>{resume.candidateName}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{resume.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.9rem' }}>{resume.job?.title || 'N/A'}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{resume.job?.department}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ 
                                                display: 'inline-flex', 
                                                alignItems: 'center', 
                                                fontWeight: '700',
                                                color: resume.similarityScore >= 80 ? '#16a34a' : resume.similarityScore >= 50 ? '#ca8a04' : '#dc2626'
                                            }}>
                                                {Math.round(resume.similarityScore)}%
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <Link to={`/resumes/${resume._id}`} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                                Click to View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminRecruiterResumes;
