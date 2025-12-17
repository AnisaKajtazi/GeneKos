import React from "react";

const AdminDietsTable = ({ diets, loading, onEdit, onDelete }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr style={{ backgroundColor: "#f2f2f2" }}>
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
            <td colSpan="6" style={{ textAlign: "center" }}>
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
                  ? `Appointment ${request.id} - ${new Date(
                      request.scheduled_date
                    ).toLocaleString()}`
                  : d.request_id
                  ? `Appointment ${d.request_id}` 
                  : "-"}
              </td>
              <td>{d.diet_plan || "-"}</td>
              <td>{new Date(d.created_at).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => onEdit(d)}
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
                  onClick={() => onDelete(d.id)}
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
          );
        })}
      </tbody>
    </table>
  );
};

export default AdminDietsTable;
