// frontend/src/pages/client/AnalysesPage.js
import React, { useEffect, useState, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const BACKEND_URL = "http://localhost:5000";

const AnalysesPage = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedPDF, setSelectedPDF] = useState(null);

  // Icons
  const DocumentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );

  const PDFIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10 11H8v5h2a2 2 0 1 0 0-4z" />
      <path d="M14 11h2a2 2 0 0 1 0 4h-2v-4z" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  const RefreshIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );

  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  // Fetch user appointments
  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/appointments/user/${user.id}`);
        const completedAppointments = (res.data.appointments || []).filter(a => a.status.toLowerCase() === "completed");
        setAppointments(completedAppointments);
        if (completedAppointments.length > 0 && !selectedAppointment) {
          setSelectedAppointment(completedAppointments[0].id);
        }
      } catch (err) {
        console.error(err);
        setError('Nuk mund të ngarkohen takimet tuaja. Ju lutem provoni përsëri.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  // Fetch analyses for selected appointment
  useEffect(() => {
    if (!selectedAppointment || !user) return;

    const fetchAnalyses = async () => {
      setRefreshing(true);
      setError('');
      try {
        const res = await axios.get(`/analysis/user/${user.id}`);
        const filtered = (res.data || []).filter(a => a.AppointmentRequest?.id === selectedAppointment);
        setAnalyses(filtered);
      } catch (err) {
        console.error(err);
        setError('Nuk mund të ngarkohen analizat për këtë takim.');
      } finally {
        setRefreshing(false);
      }
    };

    fetchAnalyses();
  }, [selectedAppointment, user]);

  const handleRefresh = () => {
    if (!selectedAppointment) return;
    setAnalyses([]);
    setRefreshing(true);
    setTimeout(() => {
      const current = selectedAppointment;
      setSelectedAppointment(null);
      setTimeout(() => setSelectedAppointment(current), 100);
    }, 300);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('sq-AL', options);
  };

  const formatTime = dateString => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('sq-AL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleOpenPDF = pdfUrl => {
    if (!pdfUrl) return;
    const url = pdfUrl.startsWith("/uploads") ? `${BACKEND_URL}${pdfUrl}` : `${BACKEND_URL}/uploads/${pdfUrl}`;
    setSelectedPDF(url);
  };

  const closePDF = () => {
    setSelectedPDF(null);
  };

  const getSelectedAppointmentDetails = () => {
    return appointments.find(a => a.id === selectedAppointment);
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem', 
      minHeight: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '2rem', 
        paddingBottom: '1.5rem', 
        borderBottom: '1px solid #e5e7eb' 
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#111827', 
            margin: '0 0 0.5rem 0', 
            lineHeight: '1.2' 
          }}>
            Analizat e Mia
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1rem', 
            margin: '0', 
            lineHeight: '1.5' 
          }}>
            Shikoni analizat tuaja mjekësore dhe rekomandimet e lidhura
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem' 
        }}>
          <button
            onClick={handleRefresh}
            disabled={refreshing || !selectedAppointment}
            style={{ 
              padding: '0.75rem 1.25rem', 
              background: 'white', 
              color: '#1f2937', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.75rem', 
              fontWeight: '600', 
              fontSize: '0.95rem', 
              cursor: refreshing || !selectedAppointment ? 'not-allowed' : 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              opacity: refreshing || !selectedAppointment ? 0.7 : 1 
            }}
            onMouseEnter={(e) => {
              if (!refreshing && selectedAppointment) {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.color = '#10b981';
              }
            }}
            onMouseLeave={(e) => {
              if (!refreshing && selectedAppointment) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.color = '#1f2937';
              }
            }}
          >
            {refreshing ? (
              <div style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid rgba(16, 185, 129, 0.3)', 
                borderTopColor: '#10b981', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }}></div>
            ) : (
              <RefreshIcon />
            )}
            <span>Rifresko</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '0.875rem 1rem', 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          borderRadius: '0.75rem', 
          color: '#ef4444', 
          marginBottom: '1.5rem', 
          fontWeight: '500', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem' 
        }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            background: '#ef4444', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 'bold', 
            fontSize: '0.875rem', 
            flexShrink: 0 
          }}>
            !
          </div>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '4rem 2rem', 
          textAlign: 'center' 
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '4px solid #e5e7eb', 
            borderTopColor: '#10b981', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            marginBottom: '1rem' 
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>Po ngarkojmë takimet tuaja...</p>
        </div>
      )}

      {/* No Appointments State */}
      {!loading && appointments.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'white', 
          borderRadius: '1rem', 
          border: '2px dashed #e5e7eb' 
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '20px', 
            background: 'rgba(16, 185, 129, 0.05)', 
            padding: '1rem', 
            margin: '0 auto 1.5rem', 
            color: '#10b981', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <CalendarIcon />
          </div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#111827', 
            margin: '0 0 0.5rem 0' 
          }}>
            Nuk keni takime të përfunduara
          </h3>
          <p style={{ 
            color: '#6b7280', 
            maxWidth: '400px', 
            margin: '0 auto', 
            lineHeight: '1.5', 
            fontSize: '0.95rem' 
          }}>
            Nuk keni asnjë takim të përfunduar. Analizat do të shfaqen këtu pasi të keni takime të përfunduara me mjekun tuaj.
          </p>
        </div>
      )}

      {/* Appointments and Analyses Section */}
      {!loading && appointments.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '300px 1fr', 
          gap: '2rem', 
          alignItems: 'start' 
        }}>
          {/* Appointments Sidebar */}
          <div style={{ 
            background: 'white', 
            borderRadius: '1rem', 
            border: '1px solid #e5e7eb', 
            overflow: 'hidden', 
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' 
          }}>
            <div style={{ 
              padding: '1.5rem', 
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02))', 
              borderBottom: '1px solid #e5e7eb' 
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827', 
                margin: '0 0 0.25rem 0' 
              }}>
                Takimet e mia
              </h3>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#6b7280', 
                margin: '0' 
              }}>
                Zgjidhni një takim për të shikuar analizat
              </p>
            </div>

            <div style={{ padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
              {appointments.map(appointment => (
                <div
                  key={appointment.id}
                  onClick={() => setSelectedAppointment(appointment.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: selectedAppointment === appointment.id 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : 'transparent',
                    border: selectedAppointment === appointment.id
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid transparent',
                    marginBottom: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAppointment !== appointment.id) {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAppointment !== appointment.id) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '0.5rem',
                      background: selectedAppointment === appointment.id
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(16, 185, 129, 0.08)',
                      color: selectedAppointment === appointment.id ? '#10b981' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <CalendarIcon />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: selectedAppointment === appointment.id ? '#10b981' : '#111827',
                        lineHeight: '1.2'
                      }}>
                        {formatDate(appointment.scheduled_date)}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        marginTop: '0.25rem'
                      }}>
                        <ClockIcon />
                        {formatTime(appointment.scheduled_date)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analyses Content */}
          <div>
            {/* Refreshing State */}
            {refreshing && (
              <div style={{
                padding: '1rem',
                textAlign: 'center',
                color: '#6b7280',
                background: '#f9fafb',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  borderTopColor: '#10b981',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 0.5rem'
                }}></div>
                Po ngarkojmë analizat...
              </div>
            )}

            {/* Selected Appointment Info */}
            {selectedAppointment && !refreshing && (
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <UserIcon />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 0.25rem 0'
                    }}>
                      Pacienti: {user?.first_name} {user?.last_name}
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.95rem',
                      margin: '0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <CalendarIcon />
                      {selectedAppointment && getSelectedAppointmentDetails() && (
                        <>
                          {formatDate(getSelectedAppointmentDetails().scheduled_date)} - 
                          {formatTime(getSelectedAppointmentDetails().scheduled_date)}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* No Analyses State */}
            {!refreshing && analyses.length === 0 && selectedAppointment && (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'white',
                borderRadius: '1rem',
                border: '2px dashed #e5e7eb'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  padding: '1rem',
                  margin: '0 auto 1.5rem',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <DocumentIcon />
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 0.5rem 0'
                }}>
                  Nuk ka analiza të disponueshme
                </h3>
                <p style={{
                  color: '#6b7280',
                  maxWidth: '400px',
                  margin: '0 auto',
                  lineHeight: '1.5',
                  fontSize: '0.95rem'
                }}>
                  Nuk ka analiza të ngarkuara për këtë takim. Analizat do të shfaqen këtu kur mjeku juaj të ngarkojë rezultatet.
                </p>
                <button
                  onClick={handleRefresh}
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    color: '#10b981',
                    border: '1px solid #10b981',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '1.5rem auto 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  <RefreshIcon />
                  Rifresko për të kontrolluar përsëri
                </button>
              </div>
            )}

            {/* Analyses List */}
            {!refreshing && analyses.length > 0 && (
              <div>
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
                    margin: '0'
                  }}>
                    Rezultatet e Analizave
                  </h2>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    background: '#f9fafb',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem'
                  }}>
                    {analyses.length} analiz{analyses.length !== 1 ? 'a' : 'ë'}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {analyses.map(analysis => {
                    const pdfFullUrl = analysis.pdf_url?.startsWith("/uploads") 
                      ? `${BACKEND_URL}${analysis.pdf_url}` 
                      : `${BACKEND_URL}/uploads/${analysis.pdf_url}`;
                    
                    return (
                      <div
                        key={analysis.id}
                        style={{
                          background: 'white',
                          borderRadius: '1rem',
                          border: '1px solid #e5e7eb',
                          padding: '1.5rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '1rem'
                        }}>
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginBottom: '0.5rem'
                            }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '0.5rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: '#10b981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <DocumentIcon />
                              </div>
                              <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: '#111827',
                                margin: '0'
                              }}>
                                {analysis.analysis_type || 'Analizë Mjekësore'}
                              </h3>
                            </div>
                            <div style={{
                              fontSize: '0.9rem',
                              color: '#6b7280',
                              marginLeft: '2.75rem'
                            }}>
                              Ngarkuar më {new Date(analysis.createdAt).toLocaleDateString('sq-AL')}
                            </div>
                          </div>
                        </div>

                        {/* PDF Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '0.75rem',
                          marginTop: '1rem'
                        }}>
                          <button
                            onClick={() => handleOpenPDF(analysis.pdf_url)}
                            style={{
                              padding: '0.625rem 1rem',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.5rem',
                              fontWeight: '600',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#059669';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#10b981';
                            }}
                          >
                            <PDFIcon />
                            Shiko PDF
                          </button>
                          <a
                            href={pdfFullUrl}
                            download
                            style={{
                              padding: '0.625rem 1rem',
                              background: 'white',
                              color: '#1f2937',
                              border: '1px solid #e5e7eb',
                              borderRadius: '0.5rem',
                              fontWeight: '600',
                              fontSize: '0.9rem',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#f9fafb';
                              e.currentTarget.style.borderColor = '#10b981';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                          >
                            <PDFIcon />
                            Shkarko PDF
                          </a>
                        </div>

                        {/* PDF Viewer Modal */}
                        {selectedPDF === pdfFullUrl && (
                          <div style={{
                            marginTop: '1.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              padding: '1rem',
                              background: '#f9fafb',
                              borderBottom: '1px solid #e5e7eb',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <span style={{ fontWeight: '600', color: '#111827' }}>
                                Shikimi i PDF: {analysis.analysis_type}
                              </span>
                              <button
                                onClick={closePDF}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: 'transparent',
                                  color: '#6b7280',
                                  border: 'none',
                                  borderRadius: '0.25rem',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = '#ef4444';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = '#6b7280';
                                }}
                              >
                                Mbyll
                              </button>
                            </div>
                            <iframe 
                              src={selectedPDF} 
                              width="100%" 
                              height="500px" 
                              title="PDF Viewer"
                              style={{ border: 'none' }}
                            ></iframe>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: 300px 1fr"] {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          div[style*="max-width: 1200px"] {
            padding: 1rem;
          }
          
          div[style*="display: flex"][style*="justify-content: space-between"] {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          h1[style*="font-size: 2rem"] {
            font-size: 1.5rem;
          }
          
          button[style*="padding: 0.75rem 1.25rem"] {
            width: 100%;
            justify-content: center;
          }
        }
        
        @media print {
          button, a[href*=".pdf"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalysesPage;