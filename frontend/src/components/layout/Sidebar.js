import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = (path) =>
    location.pathname.startsWith(path) ? 'sidebar-link active' : 'sidebar-link';

  const renderLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case 'user':
        return (
          <>
            <Link to="/dashboard/client/appointments" className={linkClass("/dashboard/client/appointments")}>
              Appointments
            </Link>
            <Link to="/analyses" className={linkClass("/analyses")}>
              Analizat
            </Link>
            <Link to="/diets" className={linkClass("/diets")}>
              Dietat
            </Link>
            <Link to="/activities" className={linkClass("/activities")}>
              Aktivitetet
            </Link>
            <Link to="/dashboard/chat" className={linkClass("/dashboard/chat")}>
              Chat
            </Link>
          </>
        );


      case 'clinic':
        return (
          <>
            <Link to="/dashboard/clinic/appointments" className={linkClass("/dashboard/clinic/appointments")}>
              Appointments
            </Link>
            <Link
              to="/dashboard/clinic/patients"
              className={linkClass("/dashboard/clinic/patients")}
            >
              Pacientët
            </Link>
            <Link to="/dashboard/clinic/PatientData" className={linkClass("/dashboard/clinic/PatientData")}>
              Shto të dhënat e pacientit
            </Link>
            <Link to="/dashboard/chat" className={linkClass("/dashboard/chat")}>
              Chat
            </Link>
          </>
        );

      case 'admin':
        return (
          <>
            <Link to="/dashboard/users" className={linkClass("/dashboard/users")}>Pacientët</Link>
            <Link to="/analyses" className={linkClass("/analyses")}>Analizat</Link>
            <Link to="/dashboard/diets" className={linkClass("/dashboard/diets")}>Dietat</Link>
            <Link to="/dashboard/activities" className={linkClass("/dashboard/activities")}>Aktivitetet</Link>
            <Link to="/dashboard/audit-logs" className={linkClass("/dashboard/audit-logs")}>Audit Logs</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1 className="logo">GeneKos</h1>

        {user && (
          <div className="user-role-indicator">
            <span className="user-role-badge">
              {user.role}
            </span>
          </div>
        )}

        <nav className="nav">
          {renderLinks()}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="content">
      </main>
    </div>
  );
};

export default Sidebar;