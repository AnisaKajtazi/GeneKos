import React from 'react';

const AdminAuditLogsTable = ({ logs, loading }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Role</th>
          <th>Action</th>
          <th>Entity</th>
          <th>Entity ID</th>
          <th>Description</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {logs.map(log => (
          <tr key={log.id}>
            <td>{log.id}</td>
            <td>{log.username}</td>
            <td>{log.role}</td>
            <td>{log.action}</td>
            <td>{log.entity}</td>
            <td>{log.entity_id || '-'}</td>
            <td>{log.description || '-'}</td>
            <td>{new Date(log.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminAuditLogsTable;
