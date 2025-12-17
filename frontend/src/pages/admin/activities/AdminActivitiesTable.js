import React from "react";

const AdminActivitiesTable = ({ activities, loading, onEdit, onDelete }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr style={{ backgroundColor: "#f2f2f2" }}>
          <th>ID</th>
          <th>User</th>
          <th>Request</th>
          <th>Activity Plan</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {activities.length === 0 && (
          <tr>
            <td colSpan="6" style={{ textAlign: "center" }}>
              No activities found
            </td>
          </tr>
        )}

        {activities.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>


            <td>
              {a.User
                ? `${a.User.first_name} ${a.User.last_name}`
                : "-"}
            </td>


            <td>
              {a.AppointmentRequest
                ? `Appointment ${a.AppointmentRequest.id} - ${new Date(
                    a.AppointmentRequest.scheduled_date
                  ).toLocaleString()}`
                : "-"}
            </td>

            <td>{a.activity_plan}</td>

            <td>{new Date(a.created_at).toLocaleString()}</td>

            <td>
              <button
                onClick={() => onEdit(a)}
                style={{
                  marginRight: "5px",
                  padding: "4px 8px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(a.id)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
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
