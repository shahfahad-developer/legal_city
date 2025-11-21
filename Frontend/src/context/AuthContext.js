import React, { createContext, useContext, useState, useEffect } from 'react';
<<<<<<< HEAD
=======
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
<<<<<<< HEAD
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
=======
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token') || searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error from URL params
      alert('Google login failed. Please try again.');
      // Clean up URL
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
      setLoading(false);
      return;
    }

    if (token) {
      // Handle OAuth token from URL params
      const isOAuthLogin = searchParams.get('token') !== null;
      if (isOAuthLogin) {
        localStorage.setItem('token', token);
        // Clean up URL
        searchParams.delete('token');
        setSearchParams(searchParams, { replace: true });
      }

      // If we are not on the Google setup pages, hydrate user from token
      const onSetupPage = location.pathname.includes('google-user-setup') || location.pathname.includes('google-lawyer-setup');
      if (!onSetupPage) {
        (async () => {
          try {
            const resp = await api.get('/auth/me');
            setUser({ ...resp.data, role: resp.data.role || (resp.data.registration_id ? 'lawyer' : 'user') });
          } catch (e) {
            // token invalid; leave user null and let guards handle
          } finally {
            setLoading(false);
          }
        })();
        return;
      }

      // On setup pages, let those pages handle hydration
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [searchParams, setSearchParams, navigate, location.pathname]);

  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
  };

  const value = {
    user,
<<<<<<< HEAD
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user
=======
    loading,
    login,
    logout,
    updateUser,
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
<<<<<<< HEAD

export default AuthContext;
=======
>>>>>>> 2d887b0789fadae1c29b3db3c146c5173bf30e47
