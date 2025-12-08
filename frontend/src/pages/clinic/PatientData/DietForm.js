import React, { useState, useEffect } from "react";
import api from "../../../api/axios";

const DietForm = ({ patientId }) => {
  const [dietPlan, setDietPlan] = useState("");
  const [diets, setDiets] = useState([]);
  const [message, setMessage] = useState("");

  const fetchDiets = async () => {
    try {
      const res = await api.get(`/diets/user/${patientId}`);
      setDiets(res.data.diets);
    } catch (err) {
      console.error(err);
      setMessage("Gabim gjatë marrjes së dietave.");
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchDiets();
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
      });

      setMessage("Dieta u shtua me sukses!");
      setDietPlan("");
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
          {diets.map((d) => (
            <li key={d.id}>
              {d.diet_plan}{" "}
              <small>({new Date(d.createdAt).toLocaleString()})</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DietForm;
