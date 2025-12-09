import React, { useState, useEffect } from "react";
import api from "../../../api/axios";

const DietForm = ({ patientId }) => {
  const [dietPlan, setDietPlan] = useState("");
  const [diets, setDiets] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState("");
  const [message, setMessage] = useState("");

  const fetchDiets = async () => {
    try {
      const res = await api.get(`/diets/user/${patientId}`);
      setDiets(res.data.diets || []); 
    } catch (err) {
      console.error(err);
      setMessage("Gabim gjatë marrjes së dietave.");
      setDiets([]);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const res = await api.get(`/analysis-results/user/${patientId}`);
      setAnalyses(res.data || []); 
    } catch (err) {
      console.error(err);
      setAnalyses([]);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchDiets();
      fetchAnalyses();
    }
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dietPlan.trim()) {
      setMessage("Shkruaj dietën para se ta dërgosh.");
      return;
    }

    try {
      await api.post("/diets", {
        user_id: patientId,
        request_id: 1, 
        diet_plan: dietPlan,
        analysis_id: selectedAnalysis || null
      });

      setMessage("Dieta u shtua me sukses!");
      setDietPlan("");
      setSelectedAnalysis("");
      fetchDiets();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Gabim gjatë shtimit të dietës.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={dietPlan}
          onChange={(e) => setDietPlan(e.target.value)}
          placeholder="Shkruaj dietën e pacientit..."
          rows={5}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <select
          value={selectedAnalysis}
          onChange={(e) => setSelectedAnalysis(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        >
          <option value="">Nuk ka analizë e lidhur</option>
          {analyses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.analysis_type || "Analizë"} -{" "}
              {new Date(a.uploaded_at || a.createdAt).toLocaleDateString()}
            </option>
          ))}
        </select>
        <button type="submit" style={{ padding: "8px 12px" }}>
          Shto Dietë
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}

      <h4 style={{ marginTop: "20px" }}>Dietat ekzistuese</h4>
      {diets.length === 0 ? (
        <p>Nuk ka dieta për këtë pacient.</p>
      ) : (
        <ul>
  {diets.map((d) => {
    const analysis = analyses.find((a) => a.id === d.analysis_id);

    return (
      <li key={d.id}>
        {d.diet_plan}{" "}
        {analysis && (
          <small>
            ({analysis.analysis_type} - {new Date(analysis.uploaded_at).toLocaleDateString()})
          </small>
        )}{" "}
        <small>({new Date(d.createdAt || d.created_at).toLocaleString()})</small>
      </li>
    );
  })}
</ul>

      )}
    </div>
  );
};

export default DietForm;
