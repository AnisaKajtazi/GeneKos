import React from 'react';

const MyAppointmentsList = ({ appointments }) => {
  return (
    <table border="1" cellPadding="8" style={{ marginBottom: '20px', width: '100%' }}>
      <thead>
        <tr>
          <th>Date & Time</th>
          <th>Status</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(a => (
          <tr key={a.id}>
            <td>{new Date(a.scheduled_date).toLocaleString()}</td>
            <td>{a.status}</td>
            <td>{a.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MyAppointmentsList;
