import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import UserAppointmentsPage from './pages/client/UserAppointmentsPage';
import ClinicAppointmentsPage from './pages/clinic/ClinicAppointmentsPage';
import PatientDataPage from './pages/clinic/PatientData/PatientDataPage';
import ChatPage from './pages/chat/ChatPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/users/AdminUsersPage';
import ClinicUsersPage from './pages/clinic/users/ClinicUsersPage';

const ChatWrapper = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <p>Loading...</p>;
  return <ChatPage currentUser={user} />;
};

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />

              <Route path="users" element={<AdminUsersPage />} />
            </Route>


            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user', 'clinic']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route path="client/appointments" element={<UserAppointmentsPage />} />
              <Route path="clinic/appointments" element={<ClinicAppointmentsPage />} />
                <Route path="clinic/patients" element={<ClinicUsersPage />} />
              <Route path="clinic/PatientData" element={<PatientDataPage />} />
              <Route path="chat" element={<ChatWrapper />} />

              <Route index element={<h2>Zgjidh një opsion nga sidebar-i</h2>} />
            </Route>

          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
