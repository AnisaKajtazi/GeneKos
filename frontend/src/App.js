import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';

import './styles/admin.css';

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
import AdminActivitiesPage from './pages/admin/activities/AdminActivitiesPage';
import AdminAuditLogsPage from './pages/admin/auditlogs/AdminAuditLogsPage';
import AdminDietsPage from './pages/admin/diets/AdminDietsPage';
import AdminAnalysisResultsPage from './pages/admin/analysis/AdminAnalysisResultsPage';
import ClinicUsersPage from './pages/clinic/users/ClinicUsersPage';
import AnalysesPage from './pages/client/AnalysesPage';
import ActivitiesPage from './pages/client/ActivitiesPage';
import UserHealthProfileHistory from './pages/client/UserHealthProfileHistory';
import DietsPage from './pages/client/DietsPage';

// ---- Chat wrapper ----
const ChatWrapper = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <p>Loading...</p>;
  return <ChatPage currentUser={user} />;
};

// ---- Role based redirect për dashboard index ----
const RoleDefaultRedirect = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Loading...</p>;

  switch (user.role) {
    case 'user':
      return <Navigate to="/dashboard/client/health-history" replace />;
    case 'clinic':
      return <Navigate to="/dashboard/clinic/appointments" replace />;
    case 'admin':
      return <Navigate to="/dashboard/users" replace />;
    default:
      return <h2>Zgjidh një opsion nga sidebar-i</h2>;
  }
};

// ---- App ----
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
                <ProtectedRoute allowedRoles={['admin', 'user', 'clinic']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              {/* Pjesa e index redirect */}
              <Route index element={<RoleDefaultRedirect />} />

              {/* Admin routes */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="analysis"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAnalysisResultsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="activities"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminActivitiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="diets"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDietsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="audit-logs"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAuditLogsPage />
                  </ProtectedRoute>
                }
              />

              {/* Client routes */}
              <Route path="client/appointments" element={<UserAppointmentsPage />} />
              <Route path="client/analyses" element={<AnalysesPage />} />
              <Route path="client/activities" element={<ActivitiesPage />} />
              <Route path="client/health-history" element={<UserHealthProfileHistory />} />
              <Route path="client/diets" element={<DietsPage />} />

              {/* Clinic routes */}
              <Route path="clinic/appointments" element={<ClinicAppointmentsPage />} />
              <Route path="clinic/patients" element={<ClinicUsersPage />} />
              <Route path="clinic/PatientData" element={<PatientDataPage />} />

              {/* Chat */}
              <Route path="chat" element={<ChatWrapper />} />

            </Route>

          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
