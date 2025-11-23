import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar>
      <div>
        <h1>Welcome to Dashboard</h1>
        <p>Zgjidh një opsion nga sidebar-i për të parë Analizat, Dietat, ose Aktivitetet.</p>
        <button onClick={handleLogout} style={{
          padding: '10px 20px',
          backgroundColor: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}>
          Logout
        </button>
      </div>
    </Sidebar>
  );
};

export default Dashboard;
