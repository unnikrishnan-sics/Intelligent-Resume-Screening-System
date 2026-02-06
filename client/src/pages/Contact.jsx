import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    // Auto-dismiss status message
    useEffect(() => {
        if (status.message) {
            const timer = setTimeout(() => {
                setStatus({ type: '', message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status.message]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/contact`, formData);
            setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1 }}>
                <div className="container page-header animate-fade-in">
                    <h1>Get in Touch</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                        Have questions? We'd love to hear from you.
                    </p>
                </div>

                <div className="container" style={{ paddingBottom: '4rem' }}>
                    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        {status.message && (
                            <div style={{
                                padding: '1rem',
                                marginBottom: '1rem',
                                borderRadius: '0.5rem',
                                backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                                color: status.type === 'success' ? '#166534' : '#991b1b'
                            }}>
                                {status.message}
                            </div>
                        )}
                        <form className="flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label style={{ fontWeight: 600 }}>Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600 }}>Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600 }}>Message</label>
                                <textarea
                                    className="form-input"
                                    rows="5"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button className="btn btn-primary w-full" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
