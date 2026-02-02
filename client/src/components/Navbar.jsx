import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand">
                    <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                        ✨
                    </div>
                    <span>IRS System</span>
                </Link>

                <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={() => setIsOpen(false)} className={isActive('/') ? 'active-link' : ''}>Home</Link>
                    <Link to="/jobs" onClick={() => setIsOpen(false)} className={isActive('/jobs') ? 'active-link' : ''}>Jobs</Link>
                    {user && user.role === 'candidate' && (
                        <Link to="/applications" onClick={() => setIsOpen(false)} className={isActive('/applications') ? 'active-link' : ''}>Applications</Link>
                    )}
                    <Link to="/about" onClick={() => setIsOpen(false)} className={isActive('/about') ? 'active-link' : ''}>About</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className={isActive('/contact') ? 'active-link' : ''}>Contact</Link>
                    {user && user.role !== 'candidate' && (
                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className={isActive('/dashboard') ? 'active-link' : ''}>Dashboard</Link>
                    )}
                    {user && (
                        <Link to="/profile" onClick={() => setIsOpen(false)} className={isActive('/profile') ? 'active-link' : ''}>Profile</Link>
                    )}

                    {/* Mobile Auth Buttons */}
                    {!user && (
                        <div className="auth-buttons-mobile">
                            <Link to="/login" className="btn btn-sm btn-outline" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/register" className="btn btn-sm btn-primary" onClick={() => setIsOpen(false)}>Register</Link>
                        </div>
                    )}

                    {user && (
                        <button onClick={handleLogout} className="btn btn-sm btn-outline mobile-only" style={{ width: '100%', marginTop: '1rem' }}>Logout</button>
                    )}
                </div>

                <div className="navbar-actions">
                    {!user ? (
                        <>
                            <Link to="/login" className="btn btn-sm btn-ghost desktop-only">Login</Link>
                            <Link to="/register" className="btn btn-sm btn-primary desktop-only">Get Started</Link>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link
                                to="/profile"
                                className="desktop-only"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    textDecoration: 'none',
                                    color: 'var(--text-main)',
                                    cursor: 'pointer'
                                }}
                                title="Go to Profile"
                            >
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hello,</span>
                                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user.name.split(' ')[0]}</span>
                                </div>
                            </Link>
                            <button onClick={handleLogout} className="btn btn-sm btn-outline desktop-only" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Logout</button>
                        </div>
                    )}
                    <button className={`hamburger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isOpen && <div className="navbar-overlay" onClick={() => setIsOpen(false)}></div>}
        </nav>
    );
};

export default Navbar;
