import React from "react";

const AdminActivitiesTable = ({ activities, loading, onEdit, onDelete }) => {
  if (loading) {
    return <p className="admin-loading">Loading...</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Appointment Request</th>
          <th>Activity Plan</th>
          <th>Analysis ID</th>
          <th>Created At</th>
          <th className="admin-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {activities.length === 0 && (
          <tr>
            <td colSpan="7" className="admin-table-empty">
              No activities found
            </td>
          </tr>
        )}

        {activities.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>

            <td>{a.User ? `${a.User.first_name} ${a.User.last_name}` : "-"}</td>

            <td>
              {a.AppointmentRequest ? (
                <>
                  <strong>#{a.AppointmentRequest.id}</strong>
                  <br />
                  <span style={{ color: "#6c757d", fontSize: "12px" }}>
                    {new Date(a.AppointmentRequest.scheduled_date).toLocaleString()}
                  </span>
                </>
              ) : (
                "-"
              )}
            </td>

            <td>{a.activity_plan || "-"}</td>
            <td>{a.analysis_id || "-"}</td>

            <td>{a.created_at ? new Date(a.created_at).toLocaleString() : "-"}</td>

            <td className="admin-actions-cell">
              <button
                className="admin-btn success"
                onClick={() => onEdit(a)}
                title="Edit Activity"
              >
                Edit
              </button>

              <button
                className="admin-btn danger"
                onClick={() => onDelete(a.id)}
                title="Delete Activity"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminActivitiesTable;
