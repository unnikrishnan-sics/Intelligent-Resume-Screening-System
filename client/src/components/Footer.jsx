import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '3rem 0', marginTop: 'auto' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>

                    <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>✨</span> IRS System
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            AI-powered resume screening and application tracking system for modern recruitment teams.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Product</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
                            <Link to="/about" style={{ color: 'var(--text-muted)' }}>Features</Link>
                            <Link to="/register" style={{ color: 'var(--text-muted)' }}>Pricing</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Company</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link to="/about" style={{ color: 'var(--text-muted)' }}>About Us</Link>
                            <Link to="/contact" style={{ color: 'var(--text-muted)' }}>Contact</Link>
                            <Link to="/login" style={{ color: 'var(--text-muted)' }}>Careers</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Legal</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link to="/" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
                            <Link to="/" style={{ color: 'var(--text-muted)' }}>Terms of Service</Link>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Intelligent Resume Screening System. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
