import React, { useState, useEffect } from "react";
import api from "../../../api/axios";

const ActivityForm = ({ patientId }) => {
  const [activityPlan, setActivityPlan] = useState("");
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState("");


  const fetchActivities = async () => {
    try {
      const res = await api.get(`/activities/user/${patientId}`);
      setActivities(res.data.activities);
    } catch (err) {
      console.error(err);
      setMessage("Gabim gjatë marrjes së aktiviteteve.");
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchActivities();
    }
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activityPlan.trim()) {
      setMessage("Shkruaj aktivitetin para se ta dërgosh.");
      return;
    }

    try {
      const res = await api.post("/activities", {
        user_id: patientId,
        request_id: 1,
        activity_plan: activityPlan,
      });

      setMessage("Aktiviteti u shtua me sukses!");
      setActivityPlan("");
      fetchActivities();
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Gabim gjatë shtimit të aktivitetit."
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={activityPlan}
          onChange={(e) => setActivityPlan(e.target.value)}
          placeholder="Shkruaj aktivitetin e pacientit..."
          rows={5}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>
          Shto Aktivitet
        </button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}

      <h4 style={{ marginTop: "20px" }}>Aktivitetet ekzistuese</h4>
      {activities.length === 0 ? (
        <p>Nuk ka aktivitete për këtë pacient.</p>
      ) : (
        <ul>
          {activities.map((a) => (
            <li key={a.id}>
              {a.activity_plan} <small>({new Date(a.created_at).toLocaleString()})</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityForm;
