import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Auto-dismiss messages
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess('');
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const userData = await login(email, password);
            setSuccess('Sign in successfully completed');

            // Short delay to show success message
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    // Eye Icons SVGs
    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
    );

    const EyeOffIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
    );

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
                    {success && <div className="text-success text-center mb-4" style={{ backgroundColor: '#dcfce7', padding: '0.75rem', borderRadius: '0.375rem' }}>{success}</div>}

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
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="eye-toggle"
                                    onClick={togglePasswordVisibility}
                                    tabIndex="-1"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
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
