import React from "react";

const AdminDietsTable = ({ diets, loading, onEdit, onDelete }) => {
  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Request</th>
          <th>Diet Plan</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {diets.length === 0 && (
          <tr>
            <td colSpan="6" className="admin-table-empty">
              No diets found
            </td>
          </tr>
        )}

        {diets.map((d) => {
          const request = d.AnalysisResult?.AppointmentRequest;

          return (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.User ? `${d.User.first_name} ${d.User.last_name}` : "-"}</td>
              <td>
                {request
                  ? `Appointment ${request.id} - ${new Date(request.scheduled_date).toLocaleString()}`
                  : d.request_id
                  ? `Appointment ${d.request_id}`
                  : "-"}
              </td>
              <td>{d.diet_plan || "-"}</td>
              <td>{new Date(d.created_at).toLocaleString()}</td>
              <td className="admin-actions-cell">
                <button className="admin-btn success" onClick={() => onEdit(d)}>
                  Edit
                </button>
                <button className="admin-btn danger" onClick={() => onDelete(d.id)}>
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AdminDietsTable;
