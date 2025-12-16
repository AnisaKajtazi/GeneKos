import React from "react";
import "../../../styles/formstyles.css"; // adjust path if needed

const AnalysisResultCard = ({ result }) => {
  // Ensure PDF link is absolute
  const pdfLink = result.pdf_url?.startsWith("/") ? result.pdf_url : `/uploads/${result.pdf_url}`;

  // Safe date parsing
  const parsedDate = result.uploaded_at || result.created_at ? new Date(result.uploaded_at || result.created_at) : null;

  const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );

  const ViewIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const handleDownload = (e) => {
    e.preventDefault();
    if (pdfLink) window.open(pdfLink, "_blank");
  };

  return (
    <div className="analysis-card">
      <div className="analysis-card-header">
        <div className="analysis-type">
          <h5>{result.analysis_type || "Analizë"}</h5>
        </div>

        {pdfLink && (
          <div className="analysis-actions">
            <a href={pdfLink} target="_blank" rel="noopener noreferrer" className="action-btn view-btn" title="Shiko PDF">
              <ViewIcon />
            </a>
            <button onClick={handleDownload} className="action-btn download-btn" title="Shkarko PDF">
              <DownloadIcon />
            </button>
          </div>
        )}
      </div>

      <div className="analysis-card-body">
        <div className="analysis-meta">
          <span className="meta-item">
            <strong>Ngarkuar:</strong> {parsedDate ? parsedDate.toLocaleDateString("sq-AL") : "N/A"}
          </span>
          <span className="meta-item">
            <strong>Koha:</strong>{" "}
            {parsedDate
              ? parsedDate.toLocaleTimeString("sq-AL", { hour: "2-digit", minute: "2-digit" })
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="analysis-card-footer">
        <span className="status-badge active">Përfunduar</span>
      </div>

      <style>{`
        .analysis-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
          background-color: #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .analysis-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .analysis-actions {
          display: flex;
          gap: 0.5rem;
        }
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border: none;
          background-color: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          background-color: #f3f4f6;
          border-radius: 0.25rem;
        }
        .analysis-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #6b7280;
        }
        .analysis-card-footer {
          margin-top: 0.5rem;
        }
        .status-badge.active {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #10b981;
          background-color: rgba(16, 185, 129, 0.1);
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default AnalysisResultCard;
