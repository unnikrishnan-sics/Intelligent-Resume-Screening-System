import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MyApplicationDetails = () => {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const { data } = await api.get(`/resumes/${id}`);
                setApplication(data);
            } catch (error) {
                console.error("Failed to fetch application details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, [id]);

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading analysis...</div>;
    if (!application) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Application not found</div>;

    // Helper to extract skills from job requirements (naive split if stored as strings)
    // Assuming backend returns reqs array or we parse it. The Job model has `requirements: [String]`
    // The resume `parsedData` has `skills: [String]`

    // We need to compare specific requirements vs found skills.
    // Ideally, the ML engine would return "missing_skills". 
    // Since we don't have that explicit field yet, let's do a client-side comparison or just show what we have.
    // For now, let's display what the AI found vs the Job Requirements list.

    const matchedSkills = application.parsedData?.skills || [];
    const jobRequirements = application.job?.requirements || [];

    // Simple case-insensitive check for now. A real "Gap Analysis" usually requires embedding comparison.
    // We will visualize the two lists side-by-side to let the user see the gap.

    const getScoreColor = (score) => {
        if (score >= 80) return '#16a34a';
        if (score >= 50) return '#ca8a04';
        return '#dc2626';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '3rem' }}>
                <div className="container" style={{ maxWidth: '900px' }}>

                    <div style={{ marginBottom: '2rem' }}>
                        <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
                    </div>

                    <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h4 style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '1px' }}>Analysis Report</h4>
                            <h1 style={{ marginBottom: '0.5rem' }}>{application.job?.title}</h1>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                                {application.job?.department} &bull; {application.job?.location}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Match Score</div>
                            <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: getScoreColor(application.similarityScore) }}>
                                {Math.round(application.similarityScore)}%
                            </div>
                        </div>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                        {/* Column 1: What the Job Needs */}
                        <div className="card">
                            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem', color: '#475569' }}>
                                📋 Job Requirements
                            </h3>
                            {jobRequirements.length > 0 ? (
                                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {jobRequirements.map((req, i) => (
                                        <li key={i} style={{ color: '#334155' }}>{req}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>No specific requirements listed.</p>
                            )}
                        </div>

                        {/* Column 2: What You Have */}
                        <div className="card" style={{ border: '2px solid #e0e7ff' }}>
                            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem', color: '#4338ca' }}>
                                ✨ Your Skills (AI Detected)
                            </h3>
                            {matchedSkills.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {matchedSkills.map((skill, i) => (
                                        <span key={i} style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '999px',
                                            backgroundColor: '#e0e7ff',
                                            color: '#4338ca',
                                            fontWeight: '500',
                                            fontSize: '0.95rem'
                                        }}>
                                            ✅ {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>The AI couldn't extract specific skills from your resume.</p>
                                </div>
                            )}

                            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                                <strong>💡 Tip:</strong> If you have skills that aren't showing up here, try adding them explicitly to your resume using standard keywords found in the requirements list.
                            </div>
                        </div>

                    </div>

                    {/* Comparison / Gap Analysis Section */}
                    {/* Since we don't have exact missing skills from backend, we can create a visual cue to manually compare */}
                    <div className="card" style={{ marginTop: '2rem', background: '#fffbeb', borderColor: '#fcd34d' }}>
                        <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Gap Analysis Insight</h3>
                        <p style={{ color: '#b45309' }}>
                            Compare your detected skills against the job requirements above.
                            Any requirements not covered by your skills list represent a <strong>potential gap</strong>.
                            Consider upskilling in these areas or highlighting them better in your CV if you already possess them.
                        </p>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyApplicationDetails;
