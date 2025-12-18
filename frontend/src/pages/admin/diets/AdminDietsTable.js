import React from "react";

const AdminDietsTable = ({ diets, loading, onEdit, onDelete }) => {
  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Kërkesa</th>
          <th>Plani i Dietës</th>
          <th>Krijuar</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {diets.length === 0 && (
          <tr>
            <td colSpan="6" className="admin-table-empty">
              Nuk u gjet asnjë dietë
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
                  Përditëso
                </button>
                <button className="admin-btn danger" onClick={() => onDelete(d.id)}>
                  Fshij
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
