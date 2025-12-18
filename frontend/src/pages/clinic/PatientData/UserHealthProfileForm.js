import React, { useState, useEffect } from "react";
import api from "../../../api/axios";

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
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const UserHealthProfileForm = ({ patientId }) => {
  const [profile, setProfile] = useState({
    height: "",
    weight: "",
    blood_type: "",
    allergies: "",
    medical_conditions: "",
    medications: ""
  });

  const [profiles, setProfiles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState("");
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateAppointmentId, setDuplicateAppointmentId] = useState(null);

  const successColor = '#10b981';
  const successColorHover = '#059669';
  const successColorLight = 'rgba(16, 185, 129, 0.1)';
  const errorColor = '#ef4444';
  const errorColorHover = '#dc2626';
  const errorColorLight = 'rgba(239, 68, 68, 0.1)';
  const warningColor = '#f59e0b';
  const warningColorLight = 'rgba(245, 158, 11, 0.1)';

  const fetchProfiles = async () => {
    try {
      const res = await api.get(`/user-health-profile/user/${patientId}`);
      setProfiles(res.data || []);
    } catch (err) {
      console.error(err);
      setProfiles([]);
      showMessage("Gabim gjatë marrjes së profileve.", "error");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get(`/appointments/user/${patientId}`);
      const completed = (res.data.appointments || []).filter(a => 
        a.status?.toLowerCase() === "completed"
      );
      setAppointments(completed);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchProfiles();
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
    setProfile({
      height: "",
      weight: "",
      blood_type: "",
      allergies: "",
      medical_conditions: "",
      medications: ""
    });
    setSelectedRequest("");
    setEditingProfileId(null);
    setShowDuplicateWarning(false);
    setDuplicateAppointmentId(null);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const checkForDuplicateAppointment = (appointmentId) => {
    if (editingProfileId) {
      const editingProfile = profiles.find(p => p.id === editingProfileId);
      if (editingProfile && editingProfile.request_id === appointmentId) {
        return false;
      }
    }
    
    const existingProfile = profiles.find(p => p.request_id === appointmentId);
    return existingProfile ? existingProfile.id : null;
  };

  const handleAppointmentChange = (e) => {
    const appointmentId = e.target.value;
    setSelectedRequest(appointmentId);
    
    if (appointmentId) {
      const duplicateId = checkForDuplicateAppointment(appointmentId);
      if (duplicateId) {
        setShowDuplicateWarning(true);
        setDuplicateAppointmentId(duplicateId);
      } else {
        setShowDuplicateWarning(false);
        setDuplicateAppointmentId(null);
      }
    } else {
      setShowDuplicateWarning(false);
      setDuplicateAppointmentId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRequest) return showMessage("Zgjidh një takim.", "error");

    if (!editingProfileId) {
      const duplicateId = checkForDuplicateAppointment(selectedRequest);
      if (duplicateId) {
        setShowDuplicateWarning(true);
        setDuplicateAppointmentId(duplicateId);
        showMessage("Ky takim tashmë ka një profil shëndetësor. Ju lutemi zgjidhni një takim tjetër.", "error");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        user_id: patientId,
        request_id: selectedRequest,
        ...profile
      };

      if (editingProfileId) {
        await api.put(`/user-health-profile/${editingProfileId}`, payload);
        showMessage("Profili u përditësua me sukses!", "success");
      } else {
        await api.post("/user-health-profile", payload);
        showMessage("Profili u krijua me sukses!", "success");
      }

      resetForm();
      fetchProfiles();
      fetchAppointments(); 
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë ruajtjes së profilit.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (p) => {
    setProfile({
      height: p.height || "",
      weight: p.weight || "",
      blood_type: p.blood_type || "",
      allergies: p.allergies || "",
      medical_conditions: p.medical_conditions || "",
      medications: p.medications || ""
    });
    setSelectedRequest(p.request_id);
    setEditingProfileId(p.id);
    setShowDuplicateWarning(false);
    setDuplicateAppointmentId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi ta fshini këtë profil?")) return;

    try {
      await api.delete(`/user-health-profile/${id}`);
      showMessage("Profili u fshi me sukses!", "success");
      fetchProfiles();
      fetchAppointments(); 
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë fshirjes së profilit.", "error");
    }
  };

  const handleCancelEdit = () => resetForm();

  const getAvailableAppointments = () => {
    if (editingProfileId) {
      return appointments.filter(a => a.status?.toLowerCase() === "completed");
    }
    
    const appointmentsWithProfiles = profiles.map(p => p.request_id);
    return appointments.filter(a => 
      a.status?.toLowerCase() === "completed" && 
      !appointmentsWithProfiles.includes(a.id)
    );
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            {editingProfileId ? 'Përditëso Profilin' : 'Krijo Profil të Ri'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Zgjidh Takimin *
                </label>
                {getAvailableAppointments().length === 0 && !editingProfileId && (
                  <span style={{
                    fontSize: '0.75rem',
                    color: warningColor,
                    backgroundColor: warningColorLight,
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem'
                  }}>
                    <WarningIcon style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Nuk ka takime të disponueshme
                  </span>
                )}
              </div>
              <select
                value={selectedRequest}
                onChange={handleAppointmentChange}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: showDuplicateWarning 
                    ? `1px solid ${warningColor}` 
                    : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  color: '#111827',
                  backgroundColor: 'white',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = showDuplicateWarning ? warningColor : successColor;
                  e.target.style.boxShadow = showDuplicateWarning 
                    ? `0 0 0 3px ${warningColorLight}` 
                    : `0 0 0 3px ${successColorLight}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = showDuplicateWarning ? warningColor : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
                required
              >
                <option value="">Zgjidh takimin</option>
                {getAvailableAppointments().map(a => {
                  const hasProfile = profiles.some(p => p.request_id === a.id);
                  return (
                    <option 
                      key={a.id} 
                      value={a.id}
                      disabled={hasProfile && !editingProfileId}
                      style={{
                        color: hasProfile && !editingProfileId ? '#9ca3af' : '#111827'
                      }}
                    >
                      {new Date(a.scheduled_date).toLocaleString("sq-AL")} ({a.status})
                      {hasProfile && !editingProfileId && ' (Ka profil)'}
                    </option>
                  );
                })}
              </select>

              {showDuplicateWarning && !editingProfileId && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: warningColorLight,
                  border: `1px solid ${warningColor}`,
                  borderRadius: '0.375rem',
                  color: '#92400e',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}>
                  <WarningIcon />
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      Ky takim tashmë ka një profil shëndetësor!
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      Ju lutemi zgjidhni një takim tjetër ose <button 
                        type="button"
                        onClick={() => handleEdit(profiles.find(p => p.id === duplicateAppointmentId))}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: warningColor,
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: 'inherit'
                        }}
                      >
                        përditësoni profilin ekzistues
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              {['height', 'weight', 'blood_type'].map(field => (
                <div key={field}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem',
                    textTransform: 'capitalize'
                  }}>
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    type={field === 'height' || field === 'weight' ? 'number' : 'text'}
                    name={field}
                    value={profile[field]}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      color: '#111827',
                      backgroundColor: 'white',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = successColor;
                      e.target.style.boxShadow = `0 0 0 3px ${successColorLight}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              ))}
            </div>

            {['allergies', 'medical_conditions', 'medications'].map(field => (
              <div key={field} style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem',
                  textTransform: 'capitalize'
                }}>
                  {field.replace('_', ' ')}
                </label>
                <textarea
                  name={field}
                  value={profile[field]}
                  onChange={handleChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    backgroundColor: 'white',
                    resize: 'vertical',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = successColor;
                    e.target.style.boxShadow = `0 0 0 3px ${successColorLight}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            ))}

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              {editingProfileId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  Anulo
                </button>
              )}
              <button
                type="submit"
                disabled={submitting || (showDuplicateWarning && !editingProfileId)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: showDuplicateWarning && !editingProfileId ? '#d1d5db' : successColor,
                  color: showDuplicateWarning && !editingProfileId ? '#6b7280' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: submitting || (showDuplicateWarning && !editingProfileId) ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!submitting && !(showDuplicateWarning && !editingProfileId)) {
                    e.currentTarget.style.backgroundColor = successColorHover;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting && !(showDuplicateWarning && !editingProfileId)) {
                    e.currentTarget.style.backgroundColor = successColor;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {submitting ? (
                  <>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Po ruhet...
                  </>
                ) : (
                  editingProfileId ? "Përditëso Profilin" : "Shto Profilin e Ri"
                )}
              </button>
            </div>
          </form>

          {message && (
            <div style={{
              marginTop: '1.5rem',
              padding: '0.875rem 1rem',
              background: messageType === 'success' 
                ? successColorLight 
                : errorColorLight,
              border: `1px solid ${messageType === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '0.75rem',
              color: messageType === 'success' ? '#065f46' : '#991b1b',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {message}
            </div>
          )}
        </div>

        <div>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                Historiku i Profileve
              </h2>
              <div style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: successColorLight,
                color: successColor,
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {profiles.length} Profil{profiles.length !== 1 ? 'e' : ''}
              </div>
            </div>

            {profiles.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: '#6b7280'
              }}>
                Nuk ka profile të regjistruara
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>
                {profiles.map(p => (
                  <div
                    key={p.id}
                    style={{
                      background: editingProfileId === p.id 
                        ? successColorLight
                        : '#f9fafb',
                      border: `2px solid ${editingProfileId === p.id ? successColor : '#e5e7eb'}`,
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (editingProfileId !== p.id) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (editingProfileId !== p.id) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {p.AppointmentRequest && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        paddingBottom: '0.75rem',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '0.5rem',
                          background: successColorLight,
                          color: successColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {new Date(p.AppointmentRequest.scheduled_date).toLocaleDateString('sq-AL', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginTop: '0.125rem'
                          }}>
                            {new Date(p.AppointmentRequest.scheduled_date).toLocaleTimeString('sq-AL', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        background: 'white',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginBottom: '0.25rem'
                        }}>
                          Gjatësia
                        </div>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#111827'
                        }}>
                          {p.height || '-'} cm
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'white',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginBottom: '0.25rem'
                        }}>
                          Pesha
                        </div>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#111827'
                        }}>
                          {p.weight || '-'} kg
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'white',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginBottom: '0.25rem'
                        }}>
                          Tipi i Gjakut
                        </div>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#111827'
                        }}>
                          {p.blood_type || '-'}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '1rem',
                      padding: '0.5rem',
                      background: 'rgba(107, 114, 128, 0.05)',
                      borderRadius: '0.375rem'
                    }}>
                      {p.updated_at && new Date(p.updated_at) > new Date(p.created_at)
                        ? `Përditësuar: ${new Date(p.updated_at).toLocaleDateString("sq-AL", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : `Krijuar: ${new Date(p.created_at).toLocaleDateString("sq-AL", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '0.5rem'
                    }}>
                      <button
                        onClick={() => handleEdit(p)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          backgroundColor: 'transparent',
                          color: successColor,
                          border: `1px solid ${successColor}`,
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = successColorLight;
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <EditIcon />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          backgroundColor: 'transparent',
                          color: errorColor,
                          border: `1px solid ${errorColor}`,
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = errorColorLight;
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <DeleteIcon />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr;
          }
          
          div[style*="gridTemplateColumns: 'repeat(3, 1fr)'"] {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 'repeat(2, 1fr)'"] {
            grid-template-columns: 1fr;
          }
          
          div[style*="padding: '2rem'"] {
            padding: 1rem;
          }
          
          div[style*="gridTemplateColumns: 'repeat(3, 1fr)'"] {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UserHealthProfileForm;