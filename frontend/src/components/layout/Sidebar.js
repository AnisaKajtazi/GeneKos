import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderLinks = () => {
    if (!user) return null;

    const linksStyle = (path) => ({
      display: 'block',
      padding: '10px 15px',
      borderRadius: '5px',
      textDecoration: 'none',
      color: location.pathname === path ? 'white' : '#333',
      backgroundColor: location.pathname === path ? '#4CAF50' : 'transparent',
      fontWeight: location.pathname === path ? '600' : '400',
      transition: '0.2s',
    });

    switch(user.role) {
      case 'user':
        return (
          <>
            <Link to="/dashboard/client/appointments" style={linksStyle("/dashboard/client/appointments")}>Appointments</Link>
            <Link to="/analyses" style={linksStyle("/analyses")}>Analizat</Link>
            <Link to="/diets" style={linksStyle("/diets")}>Dietat</Link>
            <Link to="/activities" style={linksStyle("/activities")}>Aktivitetet</Link>
            <Link to="/dashboard/chat" style={linksStyle("/dashboard/chat")}>💬 Chat</Link>
          </>
        );

      case 'clinic':
        return (
          <>
            <Link to="/dashboard/clinic/appointments" style={linksStyle("/dashboard/clinic/appointments")}>Appointments</Link>
            <Link to="/users" style={linksStyle("/users")}>Pacientët</Link>
            <Link to="/analyses" style={linksStyle("/analyses")}>Analizat</Link>
            {/* Opsionale për më vonë
            <Link to="/diets" style={linksStyle("/diets")}>Dietat</Link>
            <Link to="/activities" style={linksStyle("/activities")}>Aktivitetet</Link>
            <Link to="/upload-analysis" style={linksStyle("/upload-analysis")}>Upload Analysis PDF</Link>
            */}
            <Link to="/dashboard/chat" style={linksStyle("/dashboard/chat")}>💬 Chat</Link>
            <Link to="/dashboard/clinic/PatientData" style={linksStyle("/dashboard/clinic/PatientData")}>Shto të dhënat e pacientit</Link>
          </>
        );

      case 'admin':
        return (
          <>
            <Link to="/dashboard/users" style={linksStyle("/dashboard/users")}>Pacientët</Link>
            <Link to="/clinics" style={linksStyle("/clinics")}>Klinikat</Link>
            <Link to="/analyses" style={linksStyle("/analyses")}>Analizat</Link>
            <Link to="/diets" style={linksStyle("/diets")}>Dietat</Link>
            <Link to="/activities" style={linksStyle("/activities")}>Aktivitetet</Link>
            <Link to="/auditlogs" style={linksStyle("/auditlogs")}>Audit Logs</Link>
            <Link to="/roles" style={linksStyle("/roles")}>Sign Up & Permissions</Link>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{
        width: '220px',
        backgroundColor: '#f7f7f7',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ marginBottom: '30px', color: '#333' }}>
          GeneKos {user?.role === 'admin' ? 'Admin' : user?.role === 'clinic' ? 'Clinic' : ''}
        </h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {renderLinks()}

          <button
            onClick={handleLogout}
            style={{
              marginTop: 'auto',
              padding: '10px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: '0.2s',
            }}
            onMouseEnter={e => e.target.style.backgroundColor = '#ff7875'}
            onMouseLeave={e => e.target.style.backgroundColor = '#ff4d4f'}
          >
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
