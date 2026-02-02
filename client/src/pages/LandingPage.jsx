import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div>
            <Navbar />
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: '80px' // Offset for fixed navbar
            }}>
                <div className="container animate-fade-in">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                        Intelligent Application <br /> <span style={{ color: 'var(--primary)' }}>Tracking System</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                        Streamline your hiring process with AI-powered resume analysis. Score candidates, extract skills, and make data-driven decisions in seconds.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                            Get Started
                        </Link>
                        <Link to="/about" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                            Learn More
                        </Link>
                    </div>

                    <div className="feature-grid" style={{ marginTop: '5rem', textAlign: 'left' }}>
                        <div className="feature-card">
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
                            <h3>Instant Parsing</h3>
                            <p className="text-muted">Upload bulk resumes and extract key details automatically with high precision.</p>
                        </div>
                        <div className="feature-card">
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
                            <h3>Smart Scoring</h3>
                            <p className="text-muted">Rank candidates based on job descriptions and required skills using AI.</p>
                        </div>
                        <div className="feature-card">
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
                            <h3>Secure & Private</h3>
                            <p className="text-muted">Enterprise-grade security to ensure your candidate data remains protected.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LandingPage;
