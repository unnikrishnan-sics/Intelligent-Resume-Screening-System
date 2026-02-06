import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const ApplyJob = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Note: user might be stale if we just updated profile without reload

    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState({
        candidateName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    // Resume State
    const [file, setFile] = useState(null);
    const [useProfileResume, setUseProfileResume] = useState(false);
    const [profileResumeAvailable, setProfileResumeAvailable] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    // Fetch Job and check User Profile status
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${jobId}`);
                setJob(data);
            } catch (err) {
                setError('Job not found');
            }
        };

        const checkApplicationStatus = async () => {
            if (!user) return;
            try {
                const { data } = await api.get(`/resumes/check/${jobId}`);
                if (data.applied) {
                    setAlreadyApplied(true);
                }
            } catch (err) {
                console.error("Failed to check application status", err);
            }
        };

        fetchJob();
        checkApplicationStatus();

        // We really should check the LATEST user profile data to see if they have a resume
        // Relying on `user.resume` from AuthContext is risky if it's cached.
        // Assuming user.resume matches the backend.
        if (user) {
            setFormData(prev => ({
                ...prev,
                candidateName: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }

        if (user && user.resume) {
            setProfileResumeAvailable(true);
            setUseProfileResume(true); // Default to using it if available
        }
    }, [jobId, user]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onFileChange = e => {
        setFile(e.target.files[0]);
        setUseProfileResume(false); // If they pick a file, disable profile resume
    };

    const toggleProfileResume = () => {
        if (!useProfileResume) {
            setUseProfileResume(true);
            setFile(null); // Clear manual file
        } else {
            setUseProfileResume(false);
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!file && !useProfileResume) {
            setError('Please upload your resume or use your profile resume');
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('jobId', jobId);
        data.append('candidateName', formData.candidateName);
        data.append('email', formData.email);
        data.append('phone', formData.phone);

        if (useProfileResume) {
            data.append('useProfileResume', 'true');
        } else {
            data.append('resume', file);
        }

        try {
            await api.post('/resumes/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
            setLoading(false);
        }
    };

    if (!job && !error) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;

    if (success) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
                    <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '3rem', maxWidth: '500px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2>Application Submitted!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Your resume has been successfully uploaded for <strong>{job?.title}</strong>.
                        </p>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Our AI is analyzing your profile now. Redirecting you to dashboard...
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Navbar />

            <div style={{ flex: 1, paddingTop: '120px', paddingBottom: '3rem' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="card" style={{ padding: '0', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
                        <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h4 style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '1px' }}>Apply for</h4>
                                    <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>{job?.title}</h1>
                                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
                                        <span>🏢 {job?.department}</span>
                                        <span>📍 {job?.location}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <Link to={`/profile`} style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>Update Profile</Link>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '2.5rem' }}>
                            {error && <div className="alert alert-error" style={{ marginBottom: '2rem', padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '0.75rem', border: '1px solid #fecaca' }}>{error}</div>}

                            {alreadyApplied ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Already Applied</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                        You have already submitted an application for this position.
                                    </p>
                                    <Link to="/dashboard" className="btn btn-primary">
                                        Go to Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* ... existing form content ... */}
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Full Name</label>
                                        <input
                                            type="text"
                                            name="candidateName"
                                            value={formData.candidateName}
                                            onChange={onChange}
                                            required
                                            className="input"
                                            style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={onChange}
                                                required
                                                className="input"
                                                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={onChange}
                                                placeholder="+1 (555) 000-0000"
                                                required
                                                className="input"
                                                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Resume / CV</label>

                                        {/* Resume Options */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                            {profileResumeAvailable && (
                                                <div
                                                    onClick={toggleProfileResume}
                                                    style={{
                                                        padding: '1rem',
                                                        border: `2px solid ${useProfileResume ? 'var(--primary)' : '#e2e8f0'}`,
                                                        borderRadius: '0.75rem',
                                                        cursor: 'pointer',
                                                        backgroundColor: useProfileResume ? '#eff6ff' : 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1rem',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '20px', height: '20px', borderRadius: '50%',
                                                        border: `2px solid ${useProfileResume ? 'var(--primary)' : '#cbd5e1'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        {useProfileResume && <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></div>}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600' }}>Use Profile Resume</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                            {user?.resumeOriginalName || 'Default Resume'} (Click to select)
                                                        </div>
                                                    </div>
                                                    <div style={{ marginLeft: 'auto' }}>
                                                        <Link to="/profile" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Update</Link>
                                                    </div>
                                                </div>
                                            )}

                                            <div style={{
                                                border: `2px dashed ${!useProfileResume && file ? 'var(--primary)' : '#e2e8f0'}`,
                                                borderRadius: '0.75rem',
                                                padding: '2rem',
                                                textAlign: 'center',
                                                backgroundColor: !useProfileResume ? '#f8fafc' : '#f1f5f9',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                opacity: useProfileResume ? 0.6 : 1
                                            }}>
                                                <input
                                                    type="file"
                                                    onChange={onFileChange}
                                                    accept=".pdf,.doc,.docx"
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                                    disabled={useProfileResume && false} // Let them click to override
                                                />
                                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                                                <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                                                    {file ? file.name : (useProfileResume ? 'Or upload a different resume' : 'Upload Resume')}
                                                </p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    PDF, DOC, DOCX up to 5MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', marginTop: '1rem' }}>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-primary"
                                            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                                        >
                                            {loading ? 'Submitting Application...' : 'Submit Application'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ApplyJob;
