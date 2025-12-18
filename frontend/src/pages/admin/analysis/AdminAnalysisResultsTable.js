import React from "react";

const AdminAnalysisResultsTable = ({ results, loading, onEdit, onDelete }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr style={{ backgroundColor: "#e6f4ef" }}>
          <th>ID</th>
          <th>Pacienti</th>
          <th>Takimi</th>
          <th>Analiza</th>
          <th>PDF</th>
          <th>Data</th>
          <th>Veprime</th>
        </tr>
      </thead>
      <tbody>
        {results.length === 0 && (
          <tr>
            <td colSpan="7" style={{ textAlign: "center" }}>
              Nuk ka analiza
            </td>
          </tr>
        )}

        {results.map((r) => {
          const request = r.AppointmentRequest;
          const user = request?.User;

          return (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{user ? `${user.first_name} ${user.last_name}` : "-"}</td>
              <td>
                {request
                  ? `Takimi #${request.id} - ${new Date(
                      request.scheduled_date
                    ).toLocaleString()}`
                  : "-"}
              </td>
              <td>{r.analysis_type}</td>
              <td>
                <a href={r.pdf_url} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
              </td>
              <td>{new Date(r.uploaded_at).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => onEdit(r)}
                  style={{ marginRight: "5px" }}
                >
                  Edit
                </button>
                <button onClick={() => onDelete(r.id)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AdminAnalysisResultsTable;
