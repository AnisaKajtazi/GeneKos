import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import "../../../styles/formstyles.css";

const BACKEND_URL = "http://localhost:5000";

const AnalysisResultForm = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [analysisType, setAnalysisType] = useState("");
  const [file, setFile] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitting, setSubmitting] = useState(false);

useEffect(() => {
  const fetchAppointments = async () => {
    try {
      const res = await api.get(`/appointments/user/${patientId}`);
      const completedAppointments = (res.data.appointments || []).filter(
        (a) => a.status.toLowerCase() === "completed"
      );
      setAppointments(completedAppointments);
    } catch (err) {
      console.error(err);
    }
  };
  if (patientId) fetchAppointments();
}, [patientId]);


  const fetchAnalyses = async () => {
    try {
      const res = await api.get(`/analysis/user/${patientId}`);
      setAnalyses(res.data || []);
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë marrjes së analizave.", "error");
    }
  };

  useEffect(() => {
    if (patientId) fetchAnalyses();
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
    setAnalysisType("");
    setFile(null);
    setEditingId(null);
    setSelectedAppointment("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!analysisType.trim()) return showMessage("Shkruani llojin e analizës.", "error");
    if (!selectedAppointment) return showMessage("Zgjidhni një takim.", "error");
    if (!editingId && !file) return showMessage("Ju lutem ngarkoni një PDF.", "error");

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("analysis_type", analysisType);
      formData.append("request_id", selectedAppointment);
      if (file) formData.append("pdf", file);

      if (editingId) {
        await api.put(`/analysis/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("Analiza u përditësua me sukses!", "success");
      } else {
        await api.post("/analysis/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("Analiza u shtua me sukses!", "success");
      }

      resetForm();
      fetchAnalyses();
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Gabim gjatë ruajtjes së analizës.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (analysis) => {
    setEditingId(analysis.id);
    setAnalysisType(analysis.analysis_type);
    setFile(null);
    setSelectedAppointment(analysis.request_id || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi ta fshini analizën?")) return;

    try {
      await api.delete(`/analysis/${id}`);
      showMessage("Analiza u fshi me sukses!", "success");
      fetchAnalyses();
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë fshirjes së analizës.", "error");
    }
  };

  const handleOpenPDF = (analysis) => {
    window.open(`${BACKEND_URL}${analysis.pdf_url}`, "_blank");
  };

  const handleCancelEdit = () => resetForm();

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

  const PDFIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10 11H8v5h2a2 2 0 1 0 0-4z" />
      <path d="M14 11h2a2 2 0 0 1 0 4h-2v-4z" />
    </svg>
  );

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Zgjidh Takimin</label>
          <select
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
            className="form-input"
          >
            <option value="">Zgjidh takimin</option>
            {appointments.map((a) => (
              <option key={a.id} value={a.id}>
                {new Date(a.scheduled_date).toLocaleString("sq-AL")}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            {editingId ? "Përditëso Analizë" : "Lloji i Analizës"}
          </label>
          <input
            type="text"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            placeholder="P.sh: Analizë gjaku"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            PDF Dokument {editingId && <span className="optional">(Opsionale)</span>}
          </label>
          <div className="file-upload-area">
            <label htmlFor="fileUpload" className="file-upload-label">
              <div className="file-upload-content">
                <div className="file-icon"><PDFIcon /></div>
                <div className="file-info">
                  {file ? (
                    <>
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </>
                  ) : (
                    <>
                      <span className="file-placeholder">Kliko për të zgjedhur PDF</span>
                      <span className="file-hint">Formati: PDF, Vëllimi maksimal: 10MB</span>
                    </>
                  )}
                </div>
              </div>
              <input
                type="file"
                id="fileUpload"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input"
              />
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          {editingId && <button type="button" onClick={handleCancelEdit} className="btn-cancel">Anulo</button>}
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Duke u ngarkuar..." : editingId ? "Përditëso Analizë" : "Shto Analizë"}
          </button>
        </div>
      </form>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <div className="existing-items">
        <div className="section-header">
          <h4>Analizat ekzistuese</h4>
          <span className="count-badge">{analyses.length}</span>
        </div>

        {analyses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🧪</span>
            <p>Nuk ka analiza për këtë pacient.</p>
          </div>
        ) : (
          <div className="items-list">
            {analyses.map((a) => {
              const isEditing = editingId === a.id;
              const hasPDF = a.pdf_url;

              return (
                <div key={a.id} className={`item-card ${isEditing ? "editing" : ""}`}>
                  <div className="item-content">
                    <p className="item-text">{a.analysis_type}</p>
                    <div className="item-meta">
                      {hasPDF && (
                        <button 
                          onClick={() => handleOpenPDF(a)} 
                          className="btn-pdf"
                          style={{
                            padding: "0.25rem 0.5rem",
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            color: "#065f46",
                            border: "none",
                            borderRadius: "0.25rem",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <PDFIcon /> Shiko PDF
                        </button>
                      )}
                      <span className="date">
                        {new Date(a.createdAt).toLocaleDateString("sq-AL", {
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
                        onClick={() => handleEdit(a)} 
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
                        onClick={() => handleDelete(a.id)} 
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
    </div>
  );
};

export default AnalysisResultForm;