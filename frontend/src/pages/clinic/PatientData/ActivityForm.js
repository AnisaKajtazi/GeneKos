import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import '../../../styles/formstyles.css';

const ActivityForm = ({ patientId }) => {
  const [activityPlan, setActivityPlan] = useState("");
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const fetchActivities = async () => {
    try {
      const res = await api.get(`/activities/user/${patientId}`);
      setActivities(res.data.activities);
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë marrjes së aktiviteteve.", "error");
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchActivities();
    }
  }, [patientId]);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activityPlan.trim()) {
      showMessage("Shkruaj aktivitetin para se ta dërgosh.", "error");
      return;
    }

    try {
      const res = await api.post("/activities", {
        user_id: patientId,
        request_id: 1,
        activity_plan: activityPlan,
      });

      showMessage("Aktiviteti u shtua me sukses!", "success");
      setActivityPlan("");
      fetchActivities();
    } catch (err) {
      console.error(err);
      showMessage(
        err.response?.data?.message || "Gabim gjatë shtimit të aktivitetit.",
        "error"
      );
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="activityPlan" className="form-label">
            Plan i Aktivitetit
          </label>
          <textarea
            id="activityPlan"
            value={activityPlan}
            onChange={(e) => setActivityPlan(e.target.value)}
            placeholder="Përshkruani aktivitetet fizike të rekomanduara..."
            rows={4}
            className="form-textarea"
          />
          <p className="form-hint">
            P.sh: Stërvitje 30 min në ditë, ecje, not, etj.
          </p>
        </div>
        <button type="submit" className="btn-submit">
          Shto Aktivitet
        </button>
      </form>

      {message && (
        <div className={`message ${messageType}`}>
          <span className="message-icon">
            {messageType === "success" ? "✓" : "!"}
          </span>
          {message}
        </div>
      )}

      <div className="existing-items">
        <div className="section-header">
          <h4>Aktivitetet ekzistuese</h4>
          <span className="count-badge">{activities.length}</span>
        </div>
        
        {activities.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🏃‍♂️</span>
            <p>Nuk ka aktivitete për këtë pacient.</p>
          </div>
        ) : (
          <div className="items-list">
            {activities.map((a) => (
              <div key={a.id} className="item-card">
                <div className="item-content">
                  <p className="item-text">{a.activity_plan}</p>
                  <div className="item-meta">
                    <span className="date">
                      {new Date(a.created_at).toLocaleDateString('sq-AL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityForm;