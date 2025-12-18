import React from "react";

const AdminAnalysisResultsTable = ({ results, loading, onEdit, onDelete }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr style={{ backgroundColor: "#f2f2f2" }}>
          <th>ID</th>
          <th>User</th>
          <th>Appointment</th>
          <th>Analysis Type</th>
          <th>PDF</th>
          <th>Uploaded At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {results.length === 0 && (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              No analysis results found
            </td>
          </tr>
        )}

        {results.map((r) => {
          const request = r.AppointmentRequest;
          const user = request?.User || r.User;

          return (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{user ? `${user.first_name} ${user.last_name}` : "-"}</td>
              <td>
                {request
                  ? `Appointment ${request.id} - ${new Date(
                      request.scheduled_date
                    ).toLocaleString()}`
                  : r.request_id
                  ? `Appointment ${r.request_id}`
                  : "-"}
              </td>
              <td>{r.analysis_type || "-"}</td>
              <td>
                {r.pdf_url ? (
                  <a
                    href={r.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>{new Date(r.uploaded_at).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => onEdit(r)}
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
                  onClick={() => onDelete(r.id)}
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

export default AdminAnalysisResultsTable;
