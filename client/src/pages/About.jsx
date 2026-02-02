import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1 }}>
                <div className="container page-header animate-fade-in">
                    <h1>About the Platform</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                        Revolutionizing recruitment with Artificial Intelligence
                    </p>
                </div>

                <div className="container">
                    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            The Intelligent Resume Screening System is designed to bridge the gap between talented candidates and efficient hiring processes. By leveraging natural language processing (NLP) and machine learning, we automate the tedious task of resume screening.
                        </p>
                        <p style={{ fontSize: '1.1rem' }}>
                            Our system parses resumes, extracts key skills, and scores candidates against job requirements in real-time, allowing recruiters to focus on what matters most: interviewing the best fit.
                        </p>
                    </div>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <h3>🤖 AI-Powered Parsing</h3>
                            <p>Automatically extract contact details, skills, and education from PDF and DOCX files.</p>
                        </div>
                        <div className="feature-card">
                            <h3>📊 Smart Scoring</h3>
                            <p>Context-aware matching of candidate profiles against job descriptions.</p>
                        </div>
                        <div className="feature-card">
                            <h3>⚡ Real-time Analysis</h3>
                            <p>Get instant feedback and classification for every application.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
