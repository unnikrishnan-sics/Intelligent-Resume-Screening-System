import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/');
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span style={{ fontSize: '1.5rem' }}>✨</span>
                <span className="font-bold text-lg">
                    {user?.isAdmin ? 'Admin Panel' : 'Recruiter Panel'}
                </span>
            </div>

            <nav className="sidebar-nav">
                <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
                    <span>🏠</span> Dashboard
                </Link>

                {user?.isAdmin && (
                    <>
                        <Link to="/recruiters" className={`sidebar-link ${isActive('/recruiters') ? 'active' : ''}`}>
                            <span>👔</span> Recruiters
                        </Link>
                        <Link to="/candidates" className={`sidebar-link ${isActive('/candidates') ? 'active' : ''}`}>
                            <span>👥</span> Candidates
                        </Link>
                    </>
                )}

                <Link to="/my-jobs" className={`sidebar-link ${isActive('/my-jobs') ? 'active' : ''}`}>
                    <span>💼</span> Jobs
                </Link>

                {/* 
                <Link to="/settings" className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}>
                    <span>⚙️</span> Settings
                </Link> 
                */}
            </nav>

            <div className="sidebar-footer">
                <div style={{ padding: '0 1rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Logged in as: <br /> <strong>{user?.name}</strong>
                </div>
                <button onClick={handleLogout} className="sidebar-link w-full text-left" style={{ color: 'var(--error)' }}>
                    <span>🚪</span> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
