import React from "react";

const AnalysisResultCard = ({ result }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h4>{result.analysis_type}</h4>
      <p>
        Uploaded at: {new Date(result.uploaded_at).toLocaleString()}
      </p>
      <a
        href={result.pdf_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#007bff" }}
      >
        View PDF
      </a>
    </div>
  );
};

export default AnalysisResultCard;
