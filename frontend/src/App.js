import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import UserAppointmentsPage from './pages/client/UserAppointmentsPage';
import ClinicAppointmentsPage from './pages/clinic/ClinicAppointmentsPage';
import UploadAnalysisForm from './components/UploadAnalysisForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route path="client/appointments" element={<UserAppointmentsPage />} />
            <Route path="clinic/appointments" element={<ClinicAppointmentsPage />} />
            <Route index element={<h2>Zgjidh një opsion nga sidebar-i</h2>} />
          </Route>
          <Route path="/upload-analysis" element={
            <ProtectedRoute>
              <UploadAnalysisForm />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
