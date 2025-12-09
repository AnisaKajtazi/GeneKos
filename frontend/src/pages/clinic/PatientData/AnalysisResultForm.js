import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import AnalysisResultCard from "./AnalysisResultCard";

const AnalysisResultForm = ({ patientId }) => {
  const [analysisType, setAnalysisType] = useState("");
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const fetchAnalysisResults = async () => {
    try {
      const res = await api.get(`/analysis-results/user/${patientId}`);
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      setMessage("Gabim gjatë marrjes së analizave.");
    }
  };

  useEffect(() => {
    if (patientId) fetchAnalysisResults();
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !analysisType.trim()) {
      setMessage("Shkruaj llojin e analizës dhe zgjidh PDF-në.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("request_id", 1); // or the proper request ID
    formData.append("analysis_type", analysisType);

    try {
      await api.post("/analysis-results/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Analiza u ngarkua me sukses!");
      setAnalysisType("");
      setFile(null);
      fetchAnalysisResults();
    } catch (err) {
      console.error(err);
      setMessage("Gabim gjatë ngarkimit të analizës.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Shkruaj llojin e analizës"
          value={analysisType}
          onChange={(e) => setAnalysisType(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "10px" }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>
          Ngarko Analizën
        </button>
      </form>

      {message && <p>{message}</p>}

      <h4>Rezultatet e Analizave</h4>
      {results.length === 0 ? (
        <p>Nuk ka analiza të ngarkuara për këtë pacient.</p>
      ) : (
        results.map((r) => <AnalysisResultCard key={r.id} result={r} />)
      )}
    </div>
  );
};

export default AnalysisResultForm;
