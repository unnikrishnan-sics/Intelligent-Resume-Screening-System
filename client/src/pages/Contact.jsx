import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
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
                        <form className="flex-col gap-4">
                            <div className="form-group">
                                <label style={{ fontWeight: 600 }}>Name</label>
                                <input type="text" className="form-input" placeholder="Your Name" />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600 }}>Email</label>
                                <input type="email" className="form-input" placeholder="your@email.com" />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 600 }}>Message</label>
                                <textarea className="form-input" rows="5" placeholder="How can we help you?"></textarea>
                            </div>
                            <button className="btn btn-primary w-full">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
