import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import "../../../styles/formstyles.css";

const DietForm = ({ patientId }) => {
  const [dietPlan, setDietPlan] = useState("");
  const [diets, setDiets] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [editingDietId, setEditingDietId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDiets = async () => {
    try {
      const res = await api.get(`/diets/user/${patientId}`);
      setDiets(res.data.diets || []);
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë marrjes së dietave.", "error");
      setDiets([]);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const res = await api.get(`/analysis/user/${patientId}`);
      setAnalyses(res.data || []);
    } catch (err) {
      console.error(err);
      setAnalyses([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get(`/appointments/user/${patientId}`);
      setAppointments((res.data.appointments || []).filter(a => a.status.toLowerCase() === "completed"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchDiets();
      fetchAnalyses();
      fetchAppointments();
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

  const resetForm = () => {
    setDietPlan("");
    setSelectedAnalysis("");
    setSelectedRequest("");
    setEditingDietId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dietPlan.trim()) return showMessage("Shkruaj dietën para se ta dërgosh.", "error");
    if (!selectedRequest) return showMessage("Zgjidhni një takim.", "error");

    setSubmitting(true);
    try {
      const payload = {
        user_id: patientId,
        request_id: selectedRequest,
        diet_plan: dietPlan,
        analysis_id: selectedAnalysis || null,
      };

      if (editingDietId) {
        await api.put(`/diets/${editingDietId}`, payload);
        showMessage("Dieta u përditësua me sukses!", "success");
        setEditingDietId(null);
      } else {
        await api.post("/diets", payload);
        showMessage("Dieta u shtua me sukses!", "success");
      }

      resetForm();
      fetchDiets();
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Gabim gjatë shtimit/përditësimit të dietës.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (diet) => {
    setDietPlan(diet.diet_plan);
    setSelectedAnalysis(diet.analysis_id || "");
    setSelectedRequest(diet.request_id || "");
    setEditingDietId(diet.id);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi ta fshini këtë dietë?")) return;
    try {
      await api.delete(`/diets/${id}`);
      showMessage("Dieta u fshi me sukses!", "success");
      fetchDiets();
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Gabim gjatë fshirjes së dietës.", "error");
    }
  };

  const EditIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  const AnalysisIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );

  const DietIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Zgjidh Takimin *</label>
          <select 
            value={selectedRequest} 
            onChange={e => setSelectedRequest(e.target.value)} 
            className="form-select"
            required
          >
            <option value="">Zgjidh takimin</option>
            {appointments.map(a => (
              <option key={a.id} value={a.id}>{new Date(a.scheduled_date).toLocaleString("sq-AL")}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            {editingDietId ? "Përditëso Plan Dietik" : "Plan Dietik"}
          </label>
          <textarea 
            value={dietPlan} 
            onChange={e => setDietPlan(e.target.value)} 
            rows={4} 
            placeholder="Përshkruani dietën..."
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <AnalysisIcon /> Lidh me Analizë <span className="optional">(Opsionale)</span>
          </label>
          <select 
            value={selectedAnalysis} 
            onChange={e => setSelectedAnalysis(e.target.value)} 
            className="form-select"
          >
            <option value="">Pa analizë</option>
            {analyses.map(a => (
              <option key={a.id} value={a.id}>
                {a.analysis_type || "Analizë"} – {new Date(a.uploaded_at || a.createdAt).toLocaleDateString("sq-AL")}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          {editingDietId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              Anulo
            </button>
          )}
          <button 
            type="submit" 
            className="btn-submit"
            disabled={submitting}
            style={{ 
              flex: editingDietId ? 2 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {submitting ? (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            ) : editingDietId ? (
              'Përditëso Dietën'
            ) : (
              'Shto Dietë'
            )}
          </button>
        </div>
      </form>

      {message && (
        <div className={`message ${messageType}`}>
          <span className="message-icon">{messageType === "success" ? "✓" : "!"}</span>
          {message}
        </div>
      )}

      <div className="existing-items">
        <div className="section-header">
          <h4>Dietat ekzistuese</h4>
          <span className="count-badge">{diets.length}</span>
        </div>

        {diets.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🥗</span>
            <p>Nuk ka dieta për këtë pacient.</p>
          </div>
        ) : (
          <div className="items-list">
            {diets.map((d) => {
              const analysis = analyses.find((a) => a.id === d.analysis_id);
              const isEditing = editingDietId === d.id;

              return (
                <div 
                  key={d.id} 
                  className={`item-card ${isEditing ? 'editing' : ''}`}
                  style={{
                    borderLeft: isEditing ? '3px solid #10b981' : undefined,
                    backgroundColor: isEditing ? 'rgba(16, 185, 129, 0.05)' : undefined
                  }}
                >
                  <div className="item-content">
                    <p className="item-text">{d.diet_plan}</p>

                    <div className="item-meta">
                      <span className="analysis-tag" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        color: analysis ? '#10b981' : '#6b7280',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: analysis ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                        borderRadius: '0.25rem'
                      }}>
                        <AnalysisIcon />
                        {analysis
                          ? `${analysis.analysis_type || "Analizë"} (${new Date(
                              analysis.uploaded_at || analysis.createdAt
                            ).toLocaleDateString("sq-AL")})`
                          : "Pa analizë"}
                      </span>

                      <span className="date" style={{
                        fontSize: '0.8rem',
                        color: '#6b7280'
                      }}>
                        {d.updated_at && new Date(d.updated_at) > new Date(d.created_at)
                          ? `Përditësuar: ${new Date(d.updated_at).toLocaleDateString("sq-AL", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : new Date(d.created_at).toLocaleDateString("sq-AL", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </span>
                    </div>

                    <div className="item-actions" style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '0.5rem',
                      marginTop: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #f3f4f6'
                    }}>
                      <button 
                        onClick={() => handleEdit(d)}
                        className="btn-edit"
                        style={{
                          padding: '0.375rem 0.75rem',
                          backgroundColor: 'transparent',
                          color: '#10b981',
                          border: '1px solid #10b981',
                          borderRadius: '0.375rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <EditIcon />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(d.id)}
                        className="btn-delete"
                        style={{
                          padding: '0.375rem 0.75rem',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: '0.375rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <DeleteIcon />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .btn-edit:hover, .btn-delete:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .item-card.editing {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        
        @media (max-width: 768px) {
          .item-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .item-actions {
            flex-wrap: wrap;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DietForm;