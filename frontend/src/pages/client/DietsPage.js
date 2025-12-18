import React, { useEffect, useState, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const BACKEND_URL = "http://localhost:5000";

const DietsPage = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [diets, setDiets] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const DietIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l9 4.9V12H3V6.9L12 2z" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7" />
      <path d="M12 22V12" />
      <path d="M9 12v10" />
      <path d="M15 12v10" />
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

  const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );

  const AnalysisIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const appointmentsRes = await axios.get(`/appointments/user/${user.id}`);
        const completedAppointments = (appointmentsRes.data.appointments || []).filter(a => a.status.toLowerCase() === "completed");
        setAppointments(completedAppointments);
        
        const analysesRes = await axios.get(`/analysis/user/${user.id}`);
        setAnalyses(analysesRes.data || []);

        if (completedAppointments.length > 0 && !selectedAppointment) {
          setSelectedAppointment(completedAppointments[0].id);
        }
      } catch (err) {
        console.error(err);
        setError('Nuk mund të ngarkohen të dhënat tuaja. Ju lutem provoni përsëri.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (!selectedAppointment || !user) return;

    const fetchDiets = async () => {
      setRefreshing(true);
      setError('');
      try {
        const res = await axios.get(`/diets/user/${user.id}`);
        const filtered = (res.data.diets || []).filter(d => d.request_id === selectedAppointment);
        setDiets(filtered);
      } catch (err) {
        console.error(err);
        setError('Nuk mund të ngarkohen dietat për këtë takim.');
      } finally {
        setRefreshing(false);
      }
    };

    fetchDiets();
  }, [selectedAppointment, user]);

  const handleRefresh = () => {
    if (!selectedAppointment) return;
    setDiets([]);
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

  const getSelectedAppointmentDetails = () => {
    return appointments.find(a => a.id === selectedAppointment);
  };

  const getConnectedAnalysis = (diet) => {
    if (!diet.analysis_id) return null;
    return analyses.find(a => a.id === diet.analysis_id);
  };

  const groupDietsByAnalysis = () => {
    const grouped = {
      withAnalysis: [],
      withoutAnalysis: []
    };

    diets.forEach(diet => {
      const connectedAnalysis = getConnectedAnalysis(diet);
      if (connectedAnalysis) {
        grouped.withAnalysis.push({ diet, analysis: connectedAnalysis });
      } else {
        grouped.withoutAnalysis.push({ diet, analysis: null });
      }
    });

    const byAnalysisType = {};
    grouped.withAnalysis.forEach(({ diet, analysis }) => {
      const analysisId = analysis.id;
      if (!byAnalysisType[analysisId]) {
        byAnalysisType[analysisId] = {
          analysis,
          diets: []
        };
      }
      byAnalysisType[analysisId].diets.push(diet);
    });

    return {
      groupedByAnalysisType: byAnalysisType,
      withoutAnalysis: grouped.withoutAnalysis
    };
  };

  const { groupedByAnalysisType, withoutAnalysis } = groupDietsByAnalysis();

  const getPluralSuffix = (count) => {
    return count !== 1 ? 'a' : 'ë';
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem', 
      minHeight: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
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
            Dietat e Mia
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1rem', 
            margin: '0', 
            lineHeight: '1.5' 
          }}>
            Shikoni planet e dietës dhe rekomandimet e specialistit
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
                e.currentTarget.style.borderColor = '#f59e0b';
                e.currentTarget.style.color = '#f59e0b';
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
                border: '2px solid rgba(245, 158, 11, 0.3)', 
                borderTopColor: '#f59e0b', 
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
            borderTopColor: '#f59e0b', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            marginBottom: '1rem' 
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>Po ngarkojmë takimet tuaja...</p>
        </div>
      )}

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
            background: 'rgba(245, 158, 11, 0.05)', 
            padding: '1rem', 
            margin: '0 auto 1.5rem', 
            color: '#f59e0b', 
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
            Nuk keni asnjë takim të përfunduar. Planet e dietës do të shfaqen këtu pasi të keni takime të përfunduara me specialistin tuaj.
          </p>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '300px 1fr', 
          gap: '2rem', 
          alignItems: 'start' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '1rem', 
            border: '1px solid #e5e7eb', 
            overflow: 'hidden', 
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' 
          }}>
            <div style={{ 
              padding: '1.5rem', 
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.02))', 
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
                Zgjidhni një takim për të shikuar dietat
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
                      ? 'rgba(245, 158, 11, 0.1)' 
                      : 'transparent',
                    border: selectedAppointment === appointment.id
                      ? '1px solid rgba(245, 158, 11, 0.3)'
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
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(245, 158, 11, 0.08)',
                      color: selectedAppointment === appointment.id ? '#f59e0b' : '#6b7280',
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
                        color: selectedAppointment === appointment.id ? '#f59e0b' : '#111827',
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

          <div>
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
                  border: '2px solid rgba(245, 158, 11, 0.3)',
                  borderTopColor: '#f59e0b',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 0.5rem'
                }}></div>
                Po ngarkojmë dietat...
              </div>
            )}

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
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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

            {!refreshing && diets.length === 0 && selectedAppointment && (
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
                  background: 'rgba(245, 158, 11, 0.05)',
                  padding: '1rem',
                  margin: '0 auto 1.5rem',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <DietIcon />
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 0.5rem 0'
                }}>
                  Nuk ka dieta të disponueshme
                </h3>
                <p style={{
                  color: '#6b7280',
                  maxWidth: '400px',
                  margin: '0 auto',
                  lineHeight: '1.5',
                  fontSize: '0.95rem'
                }}>
                  Nuk ka plane dietë të ngarkuara për këtë takim. Dietat do të shfaqen këtu kur specialisti juaj të ngarkojë planet.
                </p>
                <button
                  onClick={handleRefresh}
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    color: '#f59e0b',
                    border: '1px solid #f59e0b',
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
                    e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
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

            {!refreshing && diets.length > 0 && (
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
                    Planet e Dietës
                  </h2>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      background: '#f9fafb',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <AnalysisIcon />
                      <span>{Object.keys(groupedByAnalysisType).length} Analiza</span>
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      background: '#f9fafb',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <DietIcon />
                      <span>{diets.length} Diet{getPluralSuffix(diets.length)}</span>
                    </div>
                  </div>
                </div>

                {Object.keys(groupedByAnalysisType).length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '1rem',
                      borderBottom: '2px solid rgba(245, 158, 11, 0.2)'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '0.75rem',
                        background: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <AnalysisIcon />
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          color: '#111827',
                          margin: '0 0 0.25rem 0'
                        }}>
                          Dietat me Analiza të Lidhura
                        </h3>
                        <p style={{
                          color: '#6b7280',
                          fontSize: '0.95rem',
                          margin: '0'
                        }}>
                          Planet e dietës bazuar në rezultatet e analizave tuaja
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gap: '1.5rem'
                    }}>
                      {Object.values(groupedByAnalysisType).map(({ analysis, diets: analysisDiets }) => (
                        <div
                          key={analysis.id}
                          style={{
                            background: 'white',
                            borderRadius: '1rem',
                            border: '2px solid rgba(245, 158, 11, 0.2)',
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
                            marginBottom: '1.5rem',
                            paddingBottom: '1rem',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            <div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '0.5rem'
                              }}>
                                <div style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '0.75rem',
                                  background: 'rgba(245, 158, 11, 0.1)',
                                  color: '#f59e0b',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  <AnalysisIcon />
                                </div>
                                <div>
                                  <h4 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: '#111827',
                                    margin: '0 0 0.25rem 0'
                                  }}>
                                    {analysis.analysis_type || 'Analizë Mjekësore'}
                                  </h4>
                                  <div style={{
                                    fontSize: '0.9rem',
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                  }}>
                                    <span>
                                      Ngarkuar më {new Date(analysis.createdAt).toLocaleDateString('sq-AL', {
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
                            </div>
                            <div style={{
                              padding: '0.5rem 1rem',
                              background: 'rgba(245, 158, 11, 0.1)',
                              color: '#f59e0b',
                              borderRadius: '9999px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <DietIcon />
                              {analysisDiets.length} Diet{getPluralSuffix(analysisDiets.length)}
                            </div>
                          </div>

                          <div style={{
                            display: 'grid',
                            gap: '1rem'
                          }}>
                            {analysisDiets.map(diet => (
                              <div
                                key={diet.id}
                                style={{
                                  background: '#f9fafb',
                                  borderRadius: '0.75rem',
                                  border: '1px solid #e5e7eb',
                                  padding: '1.25rem',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#f3f4f6';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#f9fafb';
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
                                      gap: '0.75rem',
                                      marginBottom: '0.5rem'
                                    }}>
                                      <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '0.5rem',
                                        background: 'rgba(245, 158, 11, 0.1)',
                                        color: '#f59e0b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                      }}>
                                        <DietIcon />
                                      </div>
                                      <h5 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        color: '#111827',
                                        margin: '0'
                                      }}>
                                        {diet.diet_plan || 'Plan Diete'}
                                      </h5>
                                    </div>
                                    
                                    <div style={{
                                      marginLeft: '2.75rem',
                                      marginBottom: '1rem'
                                    }}>
                                      <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.5rem',
                                        marginBottom: '0.5rem',
                                        color: '#374151',
                                        fontSize: '0.9rem'
                                      }}>
                                        <InfoIcon style={{ color: '#f59e0b' }} />
                                        <div style={{ flex: 1 }}>
                                          <strong style={{ color: '#111827' }}>Data e krijimit:</strong>
                                          <span style={{ marginLeft: '0.5rem' }}>
                                            {new Date(diet.created_at).toLocaleDateString('sq-AL', {
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
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {withoutAnalysis.length > 0 && (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '1rem',
                      borderBottom: '2px solid rgba(14, 165, 233, 0.2)'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '0.75rem',
                        background: 'rgba(14, 165, 233, 0.1)',
                        color: '#0ea5e9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <DietIcon />
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          color: '#111827',
                          margin: '0 0 0.25rem 0'
                        }}>
                          Dietat e Përgjithshme
                        </h3>
                        <p style={{
                          color: '#6b7280',
                          fontSize: '0.95rem',
                          margin: '0'
                        }}>
                          Planet e përgjithshme të dietës pa lidhje me analiza specifike
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gap: '1.5rem'
                    }}>
                      {withoutAnalysis.map(({ diet }) => (
                        <div
                          key={diet.id}
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
                                gap: '0.75rem',
                                marginBottom: '0.5rem'
                              }}>
                                <div style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '0.75rem',
                                  background: 'rgba(14, 165, 233, 0.1)',
                                  color: '#0ea5e9',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  <DietIcon />
                                </div>
                                <div>
                                  <h4 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: '#111827',
                                    margin: '0 0 0.25rem 0'
                                  }}>
                                    {diet.diet_plan || 'Plan Diete'}
                                  </h4>
                                  <div style={{
                                    fontSize: '0.9rem',
                                    color: '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                  }}>
                                    <span>
                                      Ngarkuar më {new Date(diet.created_at).toLocaleDateString('sq-AL', {
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
                            </div>
                          </div>

                          <div style={{
                            marginLeft: '3.25rem',
                            marginBottom: '1.5rem'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.75rem',
                              marginBottom: '0.75rem',
                              color: '#374151',
                              fontSize: '0.95rem'
                            }}>
                              <InfoIcon style={{ color: '#0ea5e9' }} />
                              <div style={{ flex: 1 }}>
                                <strong style={{ color: '#111827' }}>Data e krijimit:</strong>
                                <span style={{ marginLeft: '0.5rem' }}>
                                  {new Date(diet.created_at).toLocaleDateString('sq-AL', {
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
          
          div[style*="margin-left: 3.25rem"] {
            margin-left: 1rem !important;
          }
          
          div[style*="display: flex"][style*="gap: 0.75rem"] {
            flex-direction: column;
            align-items: flex-start;
          }
          
          div[style*="display: flex"][style*="gap: 0.5rem"]:has(> div[style*="font-size: 0.9rem"]) {
            flex-direction: column;
            align-items: stretch;
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

export default DietsPage;