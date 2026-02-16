import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('candidate');
    const [phone, setPhone] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await register(name, email, password, role, phone);

            if (role === 'recruiter' && !data.isApproved) {
                toast.success('Registration successful! Please wait for Admin approval.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                toast.success('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
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
                        <h1 style={{ fontSize: '1.75rem', color: '#1e293b' }}>Create Account</h1>
                        <p style={{ color: '#64748b' }}>Join us to streamline your hiring</p>
                    </div>

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
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Phone Number</label>
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="e.g. +1 123 456 7890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
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
