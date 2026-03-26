import { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-hot-toast';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/contact');
            setMessages(data.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await api.delete(`/contact/${id}`);
            toast.success("Message deleted successfully");
            fetchMessages();
        } catch (error) {
            toast.error("Error deleting message");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Messages</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage messages received from the contact page</p>
                </header>

                <div className="card">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading messages...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b' }}>Date</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b' }}>From</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b' }}>Message</th>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: '#64748b' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map(msg => (
                                        <tr key={msg._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                                                {formatDate(msg.createdAt)}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: '600' }}>{msg.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{msg.email}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ 
                                                    maxWidth: '400px', 
                                                    maxHeight: '100px', 
                                                    overflowY: 'auto',
                                                    fontSize: '0.9rem',
                                                    whiteSpace: 'pre-wrap',
                                                    backgroundColor: '#f8fafc',
                                                    padding: '0.5rem',
                                                    borderRadius: '0.25rem'
                                                }}>
                                                    {msg.message}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <a
                                                        href={`mailto:${msg.email}?subject=RE: Contact from ${msg.name}`}
                                                        className="btn btn-primary btn-sm"
                                                        style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem', textDecoration: 'none' }}
                                                    >
                                                        Reply Email
                                                    </a>
                                                    <button
                                                        onClick={() => deleteMessage(msg._id)}
                                                        className="btn btn-outline btn-sm"
                                                        style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem', borderColor: '#ef4444', color: '#ef4444' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {messages.length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                                No messages found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminMessages;
