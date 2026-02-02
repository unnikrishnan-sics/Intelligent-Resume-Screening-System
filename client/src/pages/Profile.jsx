import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, updateUser } = useAuth(); // Use updateUser to update context without API call


    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [resumeData, setResumeData] = useState({
        originalName: user?.resumeOriginalName
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone || '');
            setResumeData({ originalName: user.resumeOriginalName });
        }
    }, [user]);

    const onFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        setUploading(true);
        setError(null);
        setMessage(null);

        try {
            const { data } = await api.post('/resumes/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Resume updated successfully!');
            setResumeData({
                originalName: data.resumeOriginalName
            });
            // Update Auth Context with new user data (including resume)
            updateUser(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to upload resume');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { data } = await api.put('/auth/profile', {
                name,
                email,
                phone,
                password: password || undefined
            });

            setMessage('Profile updated successfully!');
            // Update Auth Context
            // Assuming the `login` function in AuthContext takes the response data object (which has token + user info)
            // If AuthContext expects just the token, this might be tricky without seeing AuthContext source.
            // But usually contexts have a way to set user.
            // If `login(data)` works, great.
            // The `login` in `AuthContext` usually does: `localStorage.setItem('user', JSON.stringify(data)); setUser(data);`
            // Let's assume this structure from typical MERN stacks.
            updateUser(data);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Navbar />
            <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
                <div className="container" style={{ maxWidth: '800px', width: '100%' }}>

                    <h1 style={{ marginBottom: '2rem' }}>Profile Settings</h1>

                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>

                        {/* Left Column: Personal Info */}
                        <div className="card" style={{ height: 'fit-content' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Personal Information</h2>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="input"
                                        placeholder="e.g. +1 123 456 7890"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                    />
                                </div>

                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Change Password</h3>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>New Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Leave blank to keep current"
                                            className="input"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            className="input"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                >
                                    {loading ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>

                        {/* Right Column: Resume Management */}
                        <div className="card" style={{ height: 'fit-content' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Resume Management</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                                Upload a default resume to speed up your job applications. You can still choose to upload a specific resume for each job.
                            </p>

                            <div style={{
                                padding: '2rem',
                                border: '2px dashed #cbd5e1',
                                borderRadius: '0.75rem',
                                textAlign: 'center',
                                position: 'relative',
                                backgroundColor: '#f8fafc',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }} className="hover:bg-gray-50">
                                <input
                                    type="file"
                                    onChange={onFileChange}
                                    accept=".pdf,.doc,.docx"
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                                />
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>

                                {uploading ? (
                                    <div>
                                        <p style={{ fontWeight: '600', color: 'var(--primary)' }}>Uploading...</p>
                                    </div>
                                ) : (
                                    <div>
                                        {resumeData?.originalName ? (
                                            <>
                                                <p style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Current Resume:</p>
                                                <p style={{ color: 'var(--primary)', fontWeight: '500', marginBottom: '1rem', wordBreak: 'break-all' }}>{resumeData.originalName}</p>
                                                <span className="btn btn-sm btn-outline" style={{ pointerEvents: 'none' }}>Click to Replace</span>
                                            </>
                                        ) : (
                                            <>
                                                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Click to Upload Resume</p>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>PDF, DOC, DOCX up to 5MB</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Why upload a profile resume?</h3>
                                <ul style={{ fontSize: '0.9rem', color: 'var(--text-muted)', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <li>One-click applications for most jobs.</li>
                                    <li>Keep your information up-to-date across platforms.</li>
                                    <li>Always handy when you find a quick opportunity.</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                    {message && <div style={{ marginTop: '2rem', padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '0.5rem', textAlign: 'center', fontWeight: '500' }}>{message}</div>}
                    {error && <div style={{ marginTop: '2rem', padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
