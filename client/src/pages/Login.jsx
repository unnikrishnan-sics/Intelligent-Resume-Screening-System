import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(email, password);
            // Redirect based on role if needed, currently all go to /dashboard which handles role-based rendering
            if (userData.role === 'recruiter' || userData.isAdmin) {
                navigate('/dashboard');
            } else {
                navigate('/dashboard'); // Candidates also to dashboard
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', paddingTop: '100px' }}>
                <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="text-center mb-4">
                        <h1 style={{ fontSize: '1.75rem', color: '#1e293b' }}>Welcome Back</h1>
                        <p style={{ color: '#64748b' }}>Please sign in to your account</p>
                    </div>

                    {error && <div className="text-danger text-center mb-4" style={{ backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '0.375rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit} className="flex-col gap-4">
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
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
                                <span style={{ fontSize: '0.8rem', color: '#2563eb', cursor: 'pointer' }}>Forgot?</span>
                            </div>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-4">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center mt-4" style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Create one</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
