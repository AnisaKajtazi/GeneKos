import React, { useState, useContext } from 'react';
import { login as apiLogin } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/auth.css';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await apiLogin(form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const LoginIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <h1 className="logo-text">GeneKos</h1>
            <div className="logo-line"></div>
          </div>
          <h2 className="auth-title">Mirë se vini</h2>
          <p className="auth-subtitle">Hyni në llogarinë tuaj për të vazhduar</p>
        </div>

        {error && (
          <div className="auth-error">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <UserIcon />
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="Shkruani username-in tuaj"
              value={form.username}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <LockIcon />
              Fjalëkalimi
            </label>
            <input
              id="password"
              name="password"
              placeholder="Shkruani fjalëkalimin tuaj"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Duke hyrë...
              </>
            ) : (
              <>
                <LoginIcon />
                Hyni
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span className="divider-text">OR</span>
        </div>

        <div className="auth-footer">
          <p className="auth-link-text">
            Nuk keni një llogari?{" "}
            <Link to="/register" className="auth-link">
              Regjistrohu këtu
            </Link>
          </p>
          <p className="auth-help-text">
            Keni harruar fjalëkalimin?{" "}
            <span className="auth-link" onClick={() => alert('Contact support for password reset')}>
              Klikoni këtu
            </span>
          </p>
        </div>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <div className="demo-info">
            <span><strong>Username:</strong> demo_user</span>
            <span><strong>Password:</strong> demo123</span>
          </div>
        </div>
      </div>

      <div className="auth-bg-pattern"></div>
      <div className="auth-bg-circle"></div>
    </div>
  );
};

export default Login;