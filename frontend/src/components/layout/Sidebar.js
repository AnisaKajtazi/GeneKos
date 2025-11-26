import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderLinks = () => {
    if (!user) return null;

    switch(user.role) {
      case 'user':
        return (
          <>
            <Link to="/dashboard/client/appointments">Appointments</Link>
            <Link to="/analyses">Analizat</Link>
            <Link to="/diets">Dietat</Link>
            <Link to="/activities">Aktivitetet</Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link to="/users">Pacientët</Link>
            <Link to="/clinics">Klinikat</Link>
            <Link to="/analyses">Analizat</Link>
            <Link to="/diets">Dietat</Link>
            <Link to="/activities">Aktivitetet</Link>
            <Link to="/auditlogs">Audit Logs</Link>
            <Link to="/roles">Sign Up & Permissions</Link>
          </>
        );
      case 'clinic':
        return (
          <>
            <Link to="/dashboard/clinic/appointments">Appointments</Link>
            <Link to="/users">Pacientët</Link>
            <Link to="/analyses">Analizat</Link>
            <Link to="/diets">Dietat</Link>
            <Link to="/activities">Aktivitetet</Link>
             <Link to="/upload-analysis">Upload Analysis PDF</Link>

          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '250px', backgroundColor: '#f0f0f0', padding: '20px', minHeight: '100vh' }}>
        <h2>GeneKos {user?.role === 'admin' ? 'Admin' : user?.role === 'clinic' ? 'Clinic' : ''}</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {renderLinks()}
          <button onClick={handleLogout} style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </nav>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
      </div>
    </div>
  );
};

export default Sidebar;
