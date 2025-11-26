import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

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
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`);
      fetchPendingAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Pending Appointments</h2>

      {pendingAppointments.length === 0 ? (
        <p>No pending appointments.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
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
            {pendingAppointments.map(a => (
              <tr key={a.id}>
                <td>{a.user_id}</td>
                <td>{new Date(a.scheduled_date).toLocaleString()}</td>
                <td>{a.note}</td>
                <td>{a.status}</td>
                <td>
                  <button onClick={() => handleApprove(a.id)}>Approve</button>
                  <button onClick={() => handleCancel(a.id)} style={{ marginLeft: '5px' }}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClinicAppointmentsPage;
