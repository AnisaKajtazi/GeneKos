import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import '../../styles/appointments.css';

const PendingAppointmentsList = ({ appointments, onApprove, onCancel }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [actionType, setActionType] = useState('');
  const [patientDetails, setPatientDetails] = useState({});

useEffect(() => {
  const fetchPatientDetails = async () => {
    const token = localStorage.getItem("token");
    const patientIds = [...new Set(appointments.map(a => a.user_id))];

    try {
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const map = {};
      res.data.forEach(u => {
        map[u.id] = {
          first_name: u.first_name,
          last_name: u.last_name
        };
      });
      const filteredMap = {};
      patientIds.forEach(id => {
        if (map[id]) {
          filteredMap[id] = map[id];
        }
      });

      setPatientDetails(filteredMap);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  if (appointments.length) {
    fetchPatientDetails();
  }
}, [appointments]);


  if (!appointments.length) {
    return (
      <div className="empty-appointments">
        <div className="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h3>Nuk ka takime në pritje</h3>
        <p>Të gjitha takimet janë trajtuar ose nuk ka takime të reja.</p>
      </div>
    );
  }

  const handleAction = async (id, action, actionName) => {
    setLoadingId(id);
    setActionType(actionName);
    try {
      if (action === 'approve') {
        await onApprove(id);
      } else {
        await onCancel(id);
      }
    } finally {
      setLoadingId(null);
      setActionType('');
    }
  };

  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const NoteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  const StatusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  const ActionsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );

  const IDIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v4" />
    </svg>
  );

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h3>Takimet në Pritje ({appointments.length})</h3>
        <p className="appointments-subtitle">Menaxhoni kërkesat e takimeve të pacientëve</p>
      </div>

      <div className="appointments-table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th className="patient-column">
                <UserIcon />
                Pacienti
              </th>
              <th className="date-column">
                <CalendarIcon />
                Data & Ora
              </th>
              <th className="note-column">
                <NoteIcon />
                Shënime
              </th>
              <th className="status-column">
                <StatusIcon />
                Statusi
              </th>
              <th className="actions-column">
                <ActionsIcon />
                Veprime
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => {
              const patient = patientDetails[appointment.user_id] || {};
              const patientName = patient.first_name && patient.last_name 
                ? `${patient.first_name} ${patient.last_name}`
                : 'N/A';
              
              return (
               <tr key={appointment.id} className="appointment-row">
  <td className="patient-cell">
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '200px'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '14px',
        flexShrink: 0
      }}>
        {patient.first_name?.[0] || patient.last_name?.[0] || 'P'}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        minWidth: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontWeight: '600',
            color: '#1f2937',
            fontSize: '14px',
            lineHeight: '1.3'
          }}>
            {patient.first_name} {patient.last_name}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          color: '#6b7280'
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v4" />
          </svg>
          <span style={{ fontSize: '11px' }}>ID: {appointment.user_id?.toString().slice(0, 8)}</span>
        </div>
      </div>
    </div>
  </td>
                  
                  <td className="date-cell">
                    <div className="date-info">
                      <span className="date-text">
                        {new Date(appointment.scheduled_date).toLocaleDateString('sq-AL', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="time-text">
                        {new Date(appointment.scheduled_date).toLocaleTimeString('sq-AL', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </td>
                  
                  <td className="note-cell">
                    <div className="note-content">
                      {appointment.note ? (
                        <span className="note-text" title={appointment.note}>
                          {appointment.note.length > 50 
                            ? `${appointment.note.substring(0, 50)}...` 
                            : appointment.note}
                        </span>
                      ) : (
                        <span className="note-empty">Nuk ka shënime</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="status-cell">
                    <span className={`status-badge status-${appointment.status?.toLowerCase()}`}>
                      {appointment.status || 'Në Pritje'}
                    </span>
                  </td>
                  
                  <td className="actions-cell">
                    <div className="actions-buttons">
                      <button
                        className="btn-approve"
                        onClick={() => handleAction(appointment.id, 'approve', 'approve')}
                        disabled={loadingId === appointment.id}
                        title="Aprovo takimin"
                      >
                        {loadingId === appointment.id && actionType === 'approve' ? (
                          <span className="action-spinner"></span>
                        ) : (
                          <CheckIcon />
                        )}
                        <span>Aprovo</span>
                      </button>
                      
                      <button
                        className="btn-cancel"
                        onClick={() => handleAction(appointment.id, 'cancel', 'cancel')}
                        disabled={loadingId === appointment.id}
                        title="Anulo takimin"
                      >
                        {loadingId === appointment.id && actionType === 'cancel' ? (
                          <span className="action-spinner"></span>
                        ) : (
                          <XIcon />
                        )}
                        <span>Anulo</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ClinicAppointmentsPage = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPendingAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get('/appointments/pending');
      setPendingAppointments(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError('Gabim gjatë marrjes së takimeve. Ju lutem provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
    
    const interval = setInterval(fetchPendingAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/appointments/${id}/approve`);
      await fetchPendingAppointments();
    } catch (err) {
      console.error(err);
      throw new Error('Gabim gjatë aprovimit të takimit');
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`);
      await fetchPendingAppointments();
    } catch (err) {
      console.error(err);
      throw new Error('Gabim gjatë anulimit të takimit');
    }
  };

  const RefreshIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );

  const StatsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );


return (
  <div className="clinic-appointments-page">
    <header className="page-header">
      <div className="header-content">
        <h1 className="page-title">Menaxhimi i Takimeve</h1>
        <p className="page-subtitle">Shikoni dhe menaxhoni takimet në pritje të klinikës suaj</p>
      </div>
      
      <div className="header-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <StatsIcon />
          </div>
          <div className="stat-content">
            <span className="stat-number">{pendingAppointments.length}</span>
            <span className="stat-label">Takime në Pritje</span>
          </div>
        </div>
        
        <button 
          className="btn-refresh"
          onClick={fetchPendingAppointments}
          disabled={loading}
          title="Rifresko listën"
        >
          <RefreshIcon />
          {loading ? 'Duke rifreskuar...' : 'Rifresko'}
        </button>
      </div>
    </header>

    {lastUpdated && (
      <div className="last-updated">
        <span className="update-text">
          Përditësuar së fundmi: {lastUpdated.toLocaleTimeString('sq-AL', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </span>
      </div>
    )}

    {error && (
      <div className="error-message">
        <span className="error-icon">!</span>
        {error}
      </div>
    )}

    {loading && pendingAppointments.length === 0 ? (
      <div className="loading-state">
        <div className="loading-spinner large"></div>
        <p>Duke ngarkuar takimet...</p>
      </div>
    ) : (

      <PendingAppointmentsList
        appointments={pendingAppointments}
        onApprove={handleApprove}
        onCancel={handleCancel}
      />
    )}

    <div className="auto-refresh-info">
      <span className="refresh-indicator">⚡</span>
      Lista rifreskohet automatikisht çdo 30 sekonda
    </div>
  </div>
);
};

export default ClinicAppointmentsPage;