import React from "react";

const AdminAuditLogsTable = ({ logs, loading, onDelete }) => {
  if (loading) return <p className="admin-loading">Loading...</p>;

  return (
    <table className="admin-table">
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
            <td colSpan="9" className="admin-table-empty">
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
            <td>{log.entity_id || "-"}</td>
            <td>{log.description || "-"}</td>
            <td>{new Date(log.created_at).toLocaleString()}</td>
            <td className="admin-actions-cell">
              <button className="admin-btn danger" onClick={() => onDelete(log.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminAuditLogsTable;
