import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import '../../../styles/formstyles.css';

const AnalysisResultForm = ({ patientId }) => {
  const [analysisType, setAnalysisType] = useState("");
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAnalysisResults = async () => {
    try {
      const res = await api.get(`/analysis/user/${patientId}`);
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë marrjes së analizave.", "error");
      setResults([]);
    }
  };

  useEffect(() => {
    if (patientId) fetchAnalysisResults();
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
    if (!analysisType.trim() || (!file && !editingId)) {
      showMessage("Shkruaj llojin e analizës dhe zgjidh PDF-në.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("analysis_type", analysisType);
      if (file) formData.append("pdf", file);

      if (editingId) {
        if (!file) {
          formData.delete('pdf'); 
        }

        await api.put(`/analysis/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("Analiza u përditësua me sukses!", "success");
        setEditingId(null);
      } else {
        formData.append("request_id", 1); 
        await api.post("/analysis/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("Analiza u ngarkua me sukses!", "success");
      }

      setAnalysisType("");
      setFile(null);
      fetchAnalysisResults();
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë ngarkimit të analizës.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi ta fshini këtë analizë?")) return;

    try {
      await api.delete(`/analysis/${id}`);
      showMessage("Analiza u fshi me sukses!", "success");
      fetchAnalysisResults();
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë fshirjes së analizës.", "error");
    }
  };


  const handleEdit = (analysis) => {
    setAnalysisType(analysis.analysis_type);
    setEditingId(analysis.id);
  };

  const handleCancelEdit = () => {
    setAnalysisType("");
    setFile(null);
    setEditingId(null);
  };


  const FileIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

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

  const handleOpenPDF = (url) => {
    const pdfLink = url.startsWith("/") ? url : `/uploads/${url}`;
    window.open(pdfLink, "_blank");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="analysisType" className="form-label">
            {editingId ? "Përditëso Analizën" : "Lloji i Analizës"}
          </label>
          <input
            type="text"
            id="analysisType"
            placeholder="Shkruaj llojin e analizës"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fileUpload" className="form-label">Ngarko PDF</label>
          <div className="file-upload-area">
            <label htmlFor="fileUpload" className="file-upload-label">
              <div className="file-upload-content">
                <div className="file-icon"><FileIcon /></div>
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
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,application/pdf"
                className="file-input"
              />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          {editingId && (
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
              flex: editingId ? 2 : 1,
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
            ) : editingId ? (
              'Përditëso Analizën'
            ) : (
              'Ngarko Analizën'
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
          <h4>Rezultatet e Analizave</h4>
          <span className="count-badge">{results.length}</span>
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🧪</span>
            <p>Nuk ka analiza të ngarkuara për këtë pacient.</p>
          </div>
        ) : (
          <div className="items-list">
            {results.map((r) => {
              const created = new Date(r.uploaded_at || r.created_at);
              const pdfLink = r.pdf_url;
              const isEditing = editingId === r.id;

              return (
                <div 
                  key={r.id} 
                  className={`item-card ${isEditing ? 'editing' : ''}`}
                  style={{
                    borderLeft: isEditing ? '3px solid #10b981' : undefined,
                    backgroundColor: isEditing ? 'rgba(16, 185, 129, 0.05)' : undefined
                  }}
                >
                  <div className="item-content">
                    <p className="item-text">{r.analysis_type}</p>
                    <div className="item-meta">
                      <span className="date" style={{
                        fontSize: '0.8rem',
                        color: '#6b7280'
                      }}>
                        Krijuar: {created.toLocaleDateString("sq-AL", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {pdfLink && (
                        <button
                          onClick={() => handleOpenPDF(pdfLink)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            color: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <PDFIcon />
                          Shiko PDF
                        </button>
                      )}
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
                        onClick={() => handleEdit(r)}
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
                        onClick={() => handleDelete(r.id)}
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

export default AnalysisResultForm;