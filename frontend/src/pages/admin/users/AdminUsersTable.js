import React from "react";

const AdminUsersTable = ({ users, loading, onEdit, onDelete }) => {
  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Emri</th>
          <th>Mbiemri</th>
          <th>Username</th>
          <th>Email</th>
          <th>Roli</th>
          <th>Nr. Tel</th>
          <th>Gjinia</th>
          <th>Data e Lindjes</th>
          <th>Adresa</th>
          <th>Statusi</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 && (
          <tr>
            <td colSpan="12" className="admin-table-empty">
              Nuk u gjet asnjë User
            </td>
          </tr>
        )}

        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.first_name}</td>
            <td>{u.last_name}</td>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.phone || "-"}</td>
            <td>{u.gender || "-"}</td>
            <td>{u.date_of_birth || "-"}</td>
            <td>{u.address || "-"}</td>
            <td>{u.is_active ? "Yes" : "No"}</td>
            <td className="admin-actions-cell">
              <button className="admin-btn success" onClick={() => onEdit(u)}>
                Perditëso
              </button>
              <button className="admin-btn danger" onClick={() => onDelete(u.id)}>
                Fshij
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminUsersTable;
