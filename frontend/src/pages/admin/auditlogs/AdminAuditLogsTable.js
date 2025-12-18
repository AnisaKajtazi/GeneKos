import React from 'react';

const AdminAuditLogsTable = ({ logs, loading, onDelete }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
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
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {logs.length === 0 && (
          <tr>
            <td colSpan="9" style={{ textAlign: 'center' }}>
              No logs found
            </td>
          </tr>
        )}

        {logs.map((log) => (
          <tr key={log.id}>
            <td>{log.id}</td>
            <td>{log.username}</td>
            <td>{log.role}</td>
            <td>{log.action}</td>
            <td>{log.entity}</td>
            <td>{log.entity_id || '-'}</td>
            <td>{log.description || '-'}</td>
            <td>{new Date(log.created_at).toLocaleString()}</td>
            <td>
              <button onClick={() => onDelete(log.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminAuditLogsTable;
