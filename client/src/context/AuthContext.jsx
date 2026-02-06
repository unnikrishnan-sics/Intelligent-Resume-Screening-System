import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Ideally verify token with backend, but for now just assuming validity or decoding if needed
                    // For a real app, you might hit a /me endpoint
                    // const { data } = await api.get('/auth/me');
                    // setUser(data);

                    // Decode token or just set a flag. 
                    // Since we don't have a /me endpoint yet, we'll assume logged in if token exists
                    // and maybe store user info in localStorage on login too
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Fallback or just set true
                        setUser({ token });
                    }
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data)); // Assuming data contains user info
        setUser(data);
        return data;
    };

    const register = async (name, email, password, role, phone) => {
        const { data } = await api.post('/auth/register', { name, email, password, role, phone });

        // If approval is needed (e.g. recruiter), backend might not send token or isApproved=false
        // logic depends on backend implementation.
        // If approved, login. Else, do not login automatically.

        if (data.isApproved) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
        }
        return data; // Return data so component can handle success message
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
