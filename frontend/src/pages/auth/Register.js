import React, { useState, useContext } from 'react';
import { register as apiRegister } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/auth.css';

const Register = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    gender: 'other',
    date_of_birth: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await apiRegister(form);
      alert("Regjistrimi u krye me sukses! Ju lutem hyni në llogarinë tuaj.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Regjistrimi dështoi. Ju lutem provoni përsëri.');
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

  const EmailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const HomeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const GenderIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  );

  const RegisterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-logo">
            <h1 className="logo-text">GeneKos</h1>
            <div className="logo-line"></div>
          </div>
          <h2 className="auth-title">Krijo një Llogari</h2>
          <p className="auth-subtitle">Plotësoni të dhënat për të krijuar një llogari të re</p>
        </div>

        {error && (
          <div className="auth-error">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name" className="form-label">
                <UserIcon />
                Emri
              </label>
              <input
                id="first_name"
                name="first_name"
                placeholder="Shkruani emrin tuaj"
                value={form.first_name}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name" className="form-label">
                <UserIcon />
                Mbiemri
              </label>
              <input
                id="last_name"
                name="last_name"
                placeholder="Shkruani mbiemrin tuaj"
                value={form.last_name}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <UserIcon />
                Username
              </label>
              <input
                id="username"
                name="username"
                placeholder="Zgjidhni një username"
                value={form.username}
                onChange={handleChange}
                required
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <EmailIcon />
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="shkruani@email.com"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Fjalëkalimi
            </label>
            <input
              id="password"
              name="password"
              placeholder="Zgjidhni një fjalëkalim të fortë"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
            />
            <p className="form-hint">Fjalëkalimi duhet të jetë të paktën 8 karaktere</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <PhoneIcon />
                Telefoni
              </label>
              <input
                id="phone"
                name="phone"
                placeholder="+355 00 000 0000"
                value={form.phone}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="date_of_birth" className="form-label">
                <CalendarIcon />
                Data e Lindjes
              </label>
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                <GenderIcon />
                Gjinia
              </label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="male">Mashkull</option>
                <option value="female">Femër</option>
                <option value="other">Tjetër</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                <HomeIcon />
                Adresa
              </label>
              <input
                id="address"
                name="address"
                placeholder="Adresa e banimit"
                value={form.address}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Duke u regjistruar...
              </>
            ) : (
              <>
                <RegisterIcon />
                Regjistrohu
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span className="divider-text">OR</span>
        </div>

        <div className="auth-footer">
          <p className="auth-link-text">
            Tashmë keni një llogari?{" "}
            <Link to="/login" className="auth-link">
              Hyni këtu
            </Link>
          </p>
          <p className="auth-help-text">
            Duke u regjistruar, ju pranoni{" "}
            <span className="auth-link" onClick={() => alert('Terms of Service')}>
              Kushtet e Shërbimit
            </span>{" "}
            dhe{" "}
            <span className="auth-link" onClick={() => alert('Privacy Policy')}>
              Politikën e Privatësisë
            </span>
          </p>
        </div>
      </div>

      <div className="auth-bg-pattern"></div>
      <div className="auth-bg-circle"></div>
    </div>
  );
};

export default Register;