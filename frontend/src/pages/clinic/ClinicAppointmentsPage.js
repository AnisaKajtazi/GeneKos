import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const PendingAppointmentsList = ({ appointments, onApprove, onCancel }) => {
  if (!appointments.length) return <p>No pending appointments.</p>;

  return (
    <table border="1" cellPadding="8" style={{ marginBottom: '20px', width: '100%' }}>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Date & Time</th>
          <th>Note</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(a => (
          <tr key={a.id}>
            <td>{a.user_id}</td>
            <td>{a.scheduled_date.replace('T', ' ')}</td>
            <td>{a.note}</td>
            <td>{a.status}</td>
            <td>
              <button onClick={() => onApprove(a.id)}>Approve</button>
              <button onClick={() => onCancel(a.id)} style={{ marginLeft: '5px' }}>
                Cancel
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ClinicAppointmentsPage = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);

  const fetchPendingAppointments = async () => {
    try {
      const res = await api.get('/appointments/pending');
      setPendingAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/appointments/${id}/approve`);
      fetchPendingAppointments();
    } catch (err) {
      console.error(err);
      alert('Gabim gjatë aprovimit të takimit');
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`);
      fetchPendingAppointments();
    } catch (err) {
      console.error(err);
      alert('Gabim gjatë anulimit të takimit');
    }
  };

  return (
    <div>
      <h2>Clinic - Pending Appointments</h2>
      <PendingAppointmentsList
        appointments={pendingAppointments}
        onApprove={handleApprove}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ClinicAppointmentsPage;
