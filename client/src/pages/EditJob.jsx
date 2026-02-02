import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        department: 'General',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: '',
        passingThreshold: 60
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setFormData({
                    title: data.title,
                    department: data.department,
                    location: data.location,
                    type: data.type,
                    description: data.description,
                    requirements: data.requirements.join('\n'),
                    passingThreshold: data.passingThreshold ?? 60
                });
            } catch (err) {
                console.error("Failed to fetch job", err);
                setError("Failed to load job details");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const { title, department, location, type, description, requirements, passingThreshold } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const reqArray = requirements.split('\n').filter(r => r.trim() !== '');

        try {
            await api.put(`/jobs/${id}`, {
                ...formData,
                requirements: reqArray
            });
            navigate('/recruiter-dashboard'); // Go back to dashboard after edit
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update job');
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading job details...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Edit Job</h1>
                    </header>

                    <div className="card" style={{ padding: '2.5rem', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
                        {error && <div className="alert alert-error" style={{ marginBottom: '2rem', padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '0.75rem', border: '1px solid #fecaca' }}>{error}</div>}

                        <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={onChange}
                                    className="input"
                                    placeholder="e.g. Senior Frontend Developer"
                                    required
                                    style={{ padding: '0.875rem 1rem', fontSize: '1rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', width: '100%', transition: 'all 0.2s' }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>Department</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', opacity: 0.5 }}>🏢</span>
                                    <input
                                        type="text"
                                        name="department"
                                        value={department}
                                        onChange={onChange}
                                        className="input"
                                        placeholder="Engineering"
                                        required
                                        style={{ padding: '0.875rem 1rem 0.875rem 3rem', fontSize: '1rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', width: '100%' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>Location</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', opacity: 0.5 }}>📍</span>
                                    <input
                                        type="text"
                                        name="location"
                                        value={location}
                                        onChange={onChange}
                                        className="input"
                                        placeholder="New York, NY"
                                        required
                                        style={{ padding: '0.875rem 1rem 0.875rem 3rem', fontSize: '1rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', width: '100%' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>Employment Type</label>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => (
                                        <label key={t} style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '999px',
                                            border: `1px solid ${type === t ? 'var(--primary)' : '#e2e8f0'}`,
                                            backgroundColor: type === t ? '#eff6ff' : 'white',
                                            color: type === t ? 'var(--primary)' : '#64748b',
                                            cursor: 'pointer',
                                            fontWeight: type === t ? '600' : '400',
                                            transition: 'all 0.2s'
                                        }}>
                                            <input
                                                type="radio"
                                                name="type"
                                                value={t}
                                                checked={type === t}
                                                onChange={onChange}
                                                style={{ display: 'none' }}
                                            />
                                            {t}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>Passing Threshold (%)</label>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Minimum AI score required to shortlist a candidate.</p>
                                <input
                                    type="number"
                                    name="passingThreshold"
                                    min="0"
                                    max="100"
                                    value={passingThreshold}
                                    onChange={onChange}
                                    className="input"
                                    required
                                    style={{ padding: '0.875rem 1rem', fontSize: '1rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', width: '120px' }}
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>Job Description</label>
                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={onChange}
                                    className="input"
                                    rows="6"
                                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                                    required
                                    style={{ fontFamily: 'inherit', padding: '1rem', fontSize: '1rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', width: '100%', resize: 'vertical' }}
                                ></textarea>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: '#334155', fontSize: '0.95rem' }}>
                                    Requirements <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '0.85rem' }}>(One per line)</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <textarea
                                        name="requirements"
                                        value={requirements}
                                        onChange={onChange}
                                        className="input"
                                        rows="6"
                                        placeholder="• Bachelor's degree in Computer Science&#10;• 5+ years of experience&#10;• Proficiency in React and Node.js"
                                        required
                                        style={{ fontFamily: 'inherit', padding: '1rem', fontSize: '1rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', width: '100%', resize: 'vertical', lineHeight: '1.6' }}
                                    ></textarea>
                                </div>
                            </div>

                            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => navigate('/recruiter-dashboard')}
                                    style={{ padding: '0.875rem 2rem', fontSize: '1rem', flex: '1', maxWidth: '200px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                    style={{ flex: 1, padding: '0.875rem', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)' }}
                                >
                                    {saving ? 'Saving...' : 'Update Job'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditJob;
