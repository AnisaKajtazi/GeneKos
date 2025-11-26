import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px', minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
