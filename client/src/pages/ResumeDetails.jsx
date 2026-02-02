// Verified clean
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const ResumeDetails = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const { data } = await api.get(`/resumes/${id}`);
                setResume(data);
            } catch (error) {
                console.error("Failed to fetch resume", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResume();
    }, [id]);

    const getScoreColor = (score) => {
        if (score >= 80) return '#16a34a'; // Green
        if (score >= 50) return '#ca8a04'; // Yellow/Orange
        return '#dc2626'; // Red
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="dashboard-main">
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
                        <div className="animate-float" style={{ fontSize: '2rem' }}>✨</div>
                    </div>
                </main>
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="dashboard-main">
                    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <h3>Resume not found</h3>
                        <Link to="/recruiter-dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Dashboard</Link>
                    </div>
                </main>
            </div>
        );
    }

    // Construct file URL. Assuming backend runs on 5000 and serves uploads at root or /uploads
    // We'll use the API base URL logic but replace /api if needed, or just hardcode for now based on known setup
    // api.defaults.baseURL is likely http://localhost:5000/api
    // files are at http://localhost:5000/uploads/... ideally
    const scoreColor = getScoreColor(resume.similarityScore);
    const fileUrl = `http://localhost:5000/${resume.filePath.replace(/\\/g, '/')}`;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                {/* Back Link */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link to={`/jobs/${resume.job._id}/applicants`} style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                        <span>&larr;</span> Back to Applicants
                    </Link>
                </div>

                {/* Header Profile Card */}
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #e0e7ff 0%, #dab4ff 100%)',
                            color: '#4f46e5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem', fontWeight: 'bold'
                        }}>
                            {resume.candidateName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', padding: 0 }}>{resume.candidateName}</h1>
                            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📧 {resume.email}</span>
                                {resume.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📱 {resume.phone}</span>}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>Match Score</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: scoreColor, lineHeight: 1, marginTop: '0.25rem' }}>
                                {Math.round(resume.similarityScore)}<span style={{ fontSize: '1.5rem' }}>%</span>
                            </div>
                        </div>
                        <div style={{ height: '50px', width: '1px', backgroundColor: '#e2e8f0' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>Verdict</div>
                            <span style={{
                                display: 'inline-block',
                                marginTop: '0.5rem',
                                padding: '0.4rem 1rem',
                                borderRadius: '999px',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                backgroundColor: resume.classification === 'Highly Suitable' ? '#dcfce7' : resume.classification === 'Moderately Suitable' ? '#fef9c3' : '#fee2e2',
                                color: resume.classification === 'Highly Suitable' ? '#166534' : resume.classification === 'Moderately Suitable' ? '#ca8a04' : '#991b1b'
                            }}>
                                {resume.classification}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>

                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Resume Preview - Main Stage */}
                        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Resume Preview</h3>
                                <a href={fileUrl} download target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none' }}>
                                    Open in New Tab ↗
                                </a>
                            </div>
                            <div style={{ height: '850px', backgroundColor: '#f1f5f9' }}>
                                <iframe
                                    src={fileUrl}
                                    title="Resume Viewer"
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                />
                            </div>
                        </div>

                        {/* Skills Analysis */}
                        <div className="card">
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>AI Recognized Skills</h3>

                            {resume.parsedData?.skills && resume.parsedData.skills.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                    {resume.parsedData.skills.map((skill, index) => (
                                        <span key={index} style={{
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: '6px',
                                            backgroundColor: '#f1f5f9',
                                            color: '#334155',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No specific skills extracted from resume.</p>
                            )}
                        </div>

                        {/* Resume Text Content */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Resume AI Summary / Preview</h3>
                            </div>
                            <div style={{
                                backgroundColor: '#f8fafc',
                                padding: '1.5rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #e2e8f0',
                                color: '#475569',
                                fontSize: '0.95rem',
                                lineHeight: '1.7',
                                whiteSpace: 'pre-wrap',
                                maxHeight: '500px',
                                overflowY: 'auto'
                            }}>
                                {resume.parsedData?.text_preview || "No text preview available."}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Actions & Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div className="card">
                            <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <a
                                    href={fileUrl}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary"
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <span>📄</span> Download Original Resume
                                </a>
                                <a
                                    href={`mailto:${resume.email}?subject=Regarding your application for ${resume.job.title}`}
                                    className="btn btn-outline"
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <span>✉️</span> Contact Candidate
                                </a>
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Application Info</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Applied For</div>
                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{resume.job.title}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Department</div>
                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{resume.job.department}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Applied On</div>
                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{new Date(resume.createdAt).toLocaleDateString()} at {new Date(resume.createdAt).toLocaleTimeString()}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
};

export default ResumeDetails;

