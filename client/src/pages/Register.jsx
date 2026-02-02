import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('candidate');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const data = await register(name, email, password, role);
            if (role === 'recruiter' && !data.isApproved) {
                setSuccess('Registration successful! Please wait for Admin approval.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', paddingTop: '100px' }}>
                <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="text-center mb-4">
                        <h1 style={{ fontSize: '1.75rem', color: '#1e293b' }}>Create Account</h1>
                        <p style={{ color: '#64748b' }}>Join us to streamline your hiring</p>
                    </div>

                    {error && <div className="text-danger text-center mb-4" style={{ backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '0.375rem' }}>{error}</div>}
                    {success && <div className="text-success text-center mb-4" style={{ backgroundColor: '#dcfce7', padding: '0.75rem', borderRadius: '0.375rem' }}>{success}</div>}

                    <form onSubmit={handleSubmit} className="flex-col gap-4">
                        <div className="form-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>I am a...</label>
                            <select
                                className="form-input"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ backgroundColor: 'white' }}
                            >
                                <option value="candidate">Candidate (Job Seeker)</option>
                                <option value="recruiter">Recruiter (Hiring Manager)</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-4">
                            Register
                        </button>
                    </form>

                    <p className="text-center mt-4" style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
