import React from "react";

const AdminAuditLogsTable = ({ logs, loading, onDelete }) => {
  if (loading) return <p className="admin-loading">Loading...</p>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Roli</th>
          <th>Action</th>
          <th>Entiteti</th>
          <th>ID e Entitetit</th>
          <th>Përshkrimi</th>
          <th>Krijuar</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {logs.length === 0 && (
          <tr>
            <td colSpan="9" className="admin-table-empty">
              Nuk u gjet asnjë Log
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
                Fshij
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminAuditLogsTable;
