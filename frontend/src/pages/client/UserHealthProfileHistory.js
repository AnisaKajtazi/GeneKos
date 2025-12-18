import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const UserHealthProfileHistory = ({ patientId }) => {
  const { user } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = '#3b82f6'; 
  const primaryColorLight = 'rgba(59, 130, 246, 0.1)';
  const primaryColorMedium = 'rgba(59, 130, 246, 0.2)';
  const primaryColorDark = '#2563eb';
  const primaryGradient = 'linear-gradient(135deg, #3b82f6, #2563eb)';

  const HealthIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
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


  const HeightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22V2M8 6l4-4 4 4M8 18l4 4 4-4" />
    </svg>
  );

  const WeightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="5" r="3" />
      <path d="M6.5 8a2 2 0 0 0-1.905 1.377L2.1 20.877A1 1 0 0 0 3.07 22h17.86a1 1 0 0 0 .97-1.243l-2.494-11.5A2 2 0 0 0 17.5 8h-11z" />
    </svg>
  );

  const BloodIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v12M12 9l-4 4M12 9l4 4" />
    </svg>
  );

  const AllergyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </svg>
  );

  const MedicalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );

  const MedicationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  );


  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/user-health-profile/user/${user.id}`);
        const profilesArray = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
        profilesArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProfiles(profilesArray);
        
        if (profilesArray.length > 0 && !selectedProfile) {
          setSelectedProfile(profilesArray[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Gabim gjatë marrjes së historisë së profileve.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  const handleRefresh = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      const res = await api.get(`/user-health-profile/user/${user.id}`);
      const profilesArray = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      profilesArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProfiles(profilesArray);
      
      if (profilesArray.length > 0) {
        setSelectedProfile(profilesArray[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Gabim gjatë rifreskimit të të dhënave.');
    } finally {
      setRefreshing(false);
    }
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
            Historiku i Profilit Shëndetësor
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1rem', 
            margin: '0', 
            lineHeight: '1.5' 
          }}>
            Shikoni historikun e të dhënave tuaja shëndetësore
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem' 
        }}>
          <button
            onClick={handleRefresh}
            disabled={refreshing || !user}
            style={{ 
              padding: '0.75rem 1.25rem', 
              background: 'white', 
              color: '#1f2937', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.75rem', 
              fontWeight: '600', 
              fontSize: '0.95rem', 
              cursor: refreshing || !user ? 'not-allowed' : 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              opacity: refreshing || !user ? 0.7 : 1 
            }}
            onMouseEnter={(e) => {
              if (!refreshing && user) {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.color = primaryColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!refreshing && user) {
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
                border: `2px solid ${primaryColorLight}`, 
                borderTopColor: primaryColor, 
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

      {profiles.length === 0 && !loading && (
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
            background: primaryColorLight, 
            padding: '1rem', 
            margin: '0 auto 1.5rem', 
            color: primaryColor, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <HealthIcon />
          </div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#111827', 
            margin: '0 0 0.5rem 0' 
          }}>
            Nuk keni profile shëndetësore të regjistruara
          </h3>
          <p style={{ 
            color: '#6b7280', 
            maxWidth: '400px', 
            margin: '0 auto', 
            lineHeight: '1.5', 
            fontSize: '0.95rem' 
          }}>
            Nuk keni asnjë profil shëndetësor të regjistruar. Profilet shëndetësore do të shfaqen këtu pasi të regjistrohen.
          </p>
        </div>
      )}

      {profiles.length > 0 && (
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
              background: `linear-gradient(90deg, ${primaryColorLight}, rgba(59, 130, 246, 0.02))`, 
              borderBottom: '1px solid #e5e7eb' 
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827', 
                margin: '0 0 0.25rem 0' 
              }}>
                Profilet e mia
              </h3>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#6b7280', 
                margin: '0' 
              }}>
                Zgjidhni një profil për të shikuar detajet
              </p>
            </div>

            <div style={{ padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
             {profiles.map(profile => (
  <div
    key={profile.id}
    onClick={() => setSelectedProfile(profile)}
    style={{
      padding: '1rem',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: selectedProfile?.id === profile.id 
        ? primaryColorLight 
        : 'transparent',
      border: selectedProfile?.id === profile.id
        ? `1px solid ${primaryColorMedium}`
        : '1px solid transparent',
      marginBottom: '0.5rem'
    }}
    onMouseEnter={(e) => {
      if (selectedProfile?.id !== profile.id) {
        e.currentTarget.style.background = '#f9fafb';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }
    }}
    onMouseLeave={(e) => {
      if (selectedProfile?.id !== profile.id) {
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
        background: selectedProfile?.id === profile.id
          ? 'rgba(59, 130, 246, 0.15)'
          : 'rgba(59, 130, 246, 0.08)',
        color: selectedProfile?.id === profile.id ? primaryColor : '#6b7280',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <CalendarIcon />
      </div>

      <div style={{ flex: 1 }}>
        {profile.appointment && (
          <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#111827' }}>
            Takimi: {new Date(profile.appointment.scheduled_date).toLocaleString('sq-AL')} ({profile.appointment.status})
          </div>
        )}

        <div style={{
          fontSize: '0.95rem',
          fontWeight: '600',
          color: selectedProfile?.id === profile.id ? primaryColor : '#111827',
          lineHeight: '1.2',
          marginTop: '0.25rem'
        }}>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: '#6b7280',
          marginTop: '0.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <HeightIcon />
            <span>{profile.height} cm</span>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <WeightIcon />
            <span>{profile.weight} kg</span>
          </div>
        </div>
      </div>
    </div>
  </div>
))}

            </div>
          </div>

          <div>
            {selectedProfile && (
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                padding: '2rem',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '2rem',
                  paddingBottom: '1.5rem',
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
                        width: '48px',
                        height: '48px',
                        borderRadius: '0.75rem',
                        background: primaryGradient,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <UserIcon />
                      </div>
                      <div>
                        <h2 style={{
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          color: '#111827',
                          margin: '0 0 0.25rem 0'
                        }}>
                          Profili Shëndetësor
                        </h2>
                        <p style={{
                          color: '#6b7280',
                          fontSize: '0.95rem',
                          margin: '0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '0.75rem 1.5rem',
                    background: primaryColorLight,
                    color: primaryColor,
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <HealthIcon />
                    Profil Shëndetësor
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    padding: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '0.5rem',
                        background: primaryColorLight,
                        color: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <HeightIcon />
                      </div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0'
                      }}>
                        Gjatësia & Pesha
                      </h3>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem'
                    }}>
                      <div style={{
                        background: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        padding: '1rem'
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <HeightIcon />
                          Gjatësia
                        </div>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          color: '#111827'
                        }}>
                          {selectedProfile.height} <span style={{ fontSize: '1rem', color: '#6b7280' }}>cm</span>
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb',
                        padding: '1rem'
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          marginBottom: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <WeightIcon />
                          Pesha
                        </div>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          color: '#111827'
                        }}>
                          {selectedProfile.weight} <span style={{ fontSize: '1rem', color: '#6b7280' }}>kg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    padding: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '0.5rem',
                        background: primaryColorLight,
                        color: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <BloodIcon />
                      </div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0'
                      }}>
                        Tipi i Gjakut
                      </h3>
                    </div>
                    
                    <div style={{
                      background: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      padding: '1.5rem',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: primaryColorDark,
                        marginBottom: '0.5rem'
                      }}>
                        {selectedProfile.blood_type || 'N/A'}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        Grupi i gjakut
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    padding: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '0.5rem',
                        background: primaryColorLight,
                        color: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <AllergyIcon />
                      </div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0'
                      }}>
                        Alergjitë
                      </h3>
                    </div>
                    
                    <div style={{
                      background: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      padding: '1rem',
                      minHeight: '100px'
                    }}>
                      <div style={{
                        fontSize: '0.95rem',
                        color: '#374151',
                        lineHeight: '1.5'
                      }}>
                        {selectedProfile.allergies || 'Nuk ka alergji të regjistruara'}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    padding: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '0.5rem',
                        background: primaryColorLight,
                        color: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <MedicalIcon />
                      </div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0'
                      }}>
                        Sëmundjet Mjekësore
                      </h3>
                    </div>
                    
                    <div style={{
                      background: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      padding: '1rem',
                      minHeight: '100px'
                    }}>
                      <div style={{
                        fontSize: '0.95rem',
                        color: '#374151',
                        lineHeight: '1.5'
                      }}>
                        {selectedProfile.medical_conditions || 'Nuk ka sëmundje mjekësore të regjistruara'}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    padding: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '0.5rem',
                        background: primaryColorLight,
                        color: primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <MedicationIcon />
                      </div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0'
                      }}>
                        Mjekimet
                      </h3>
                    </div>
                    
                    <div style={{
                      background: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      padding: '1rem',
                      minHeight: '100px'
                    }}>
                      <div style={{
                        fontSize: '0.95rem',
                        color: '#374151',
                        lineHeight: '1.5'
                      }}>
                        {selectedProfile.medications || 'Nuk ka mjekime të regjistruara'}
                      </div>
                    </div>
                  </div>
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
          
          div[style*="gridTemplateColumns: repeat(auto-fit, minmax(300px, 1fr))"] {
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
          
          div[style*="display: grid"][style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          div[style*="padding: 2rem"] {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserHealthProfileHistory;