import React from "react";

const AdminAnalysisResultsTable = ({ results, loading, onEdit, onDelete }) => {
  if (loading) return <p className="admin-loading">Loading...</p>;

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Pacienti</th>
            <th>Takimi</th>
            <th>Analiza</th>
            <th>PDF</th>
            <th>Data</th>
            <th className="admin-center">Veprime</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 && (
            <tr>
              <td colSpan="7" className="admin-table-empty">
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
                <td>{r.uploaded_at ? new Date(r.uploaded_at).toLocaleString() : "-"}</td>
                <td className="admin-actions-cell">
                  <button
                    className="admin-btn small success"
                    onClick={() => onEdit(r)}
                    title="Edit Analysis"
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn small danger"
                    onClick={() => onDelete(r.id)}
                    title="Delete Analysis"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAnalysisResultsTable;
