import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const MyAppointmentsList = ({ appointments }) => {
  if (!appointments || !appointments.length) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        color: '#6c757d'
      }}>
        <p style={{ margin: 0, fontSize: '1.1rem' }}>Nuk ka Termine deri tani.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      overflowX: 'auto',
      marginBottom: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '600px'
      }}>
        <thead style={{
          backgroundColor: '#10b981',
          color: 'white'
        }}>
          <tr>
            <th style={{
              padding: '1rem',
              textAlign: 'left',
              fontWeight: '600',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Data & Ora</th>
            <th style={{
              padding: '1rem',
              textAlign: 'left',
              fontWeight: '600',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Statusi</th>
            <th style={{
              padding: '1rem',
              textAlign: 'left',
              fontWeight: '600',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Shënimet</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, index) => (
            <tr 
              key={a.id} 
              style={{
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc'}
            >
              <td style={{
                padding: '1rem',
                color: '#1f2937',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                {new Date(a.scheduled_date).toLocaleString('sq-AL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td style={{ padding: '1rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  backgroundColor: 
                    a.status === 'approved' ? '#d1fae5' :
                    a.status === 'pending' ? '#fef3c7' :
                    a.status === 'cancelled' ? '#fee2e2' : '#e5e7eb',
                  color: 
                    a.status === 'approved' ? '#065f46' :
                    a.status === 'pending' ? '#92400e' :
                    a.status === 'cancelled' ? '#991b1b' : '#4b5563'
                }}>
                  {a.status}
                </span>
              </td>
              <td style={{
                padding: '1rem',
                color: '#6b7280',
                fontSize: '0.9rem',
                maxWidth: '300px',
                wordBreak: 'break-word'
              }}>
                {a.note || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserAppointmentsPage = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/appointments/user/${user.id}`);
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;
    try {
      const res = await api.get(`/appointments/available?date=${selectedDate}`);
      setAvailableSlots(res.data.available_slots || []);
    } catch (err) {
      console.error(err);
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const handleRequestAppointment = async () => {
    if (!selectedDate || !selectedSlot) {
      alert('Ju lutem zgjidhni datën dhe slot-in');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/appointments', {
        user_id: user.id,
        scheduled_date: `${selectedDate}T${selectedSlot}`,
        note
      });
      
      alert('Kërkesa për takim u dërgua me sukses!');
      setSelectedDate('');
      setSelectedSlot('');
      setNote('');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gabim gjatë dërgimit të kërkesës');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{
        marginBottom: '2.5rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#111827',
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Takimet e Mia
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1.1rem'
        }}>
          Menaxhoni takimet tuaja me klinikën
        </p>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            color: '#1f2937',
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0
          }}>
            Takimet Aktuale
          </h2>
          <button
            onClick={fetchAppointments}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#10b981',
              border: '1px solid #10b981',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#10b981';
            }}
          >
            Rifresko
          </button>
        </div>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e5e7eb',
              borderTopColor: '#10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p>Duke ngarkuar takimet...</p>
          </div>
        ) : (
          <MyAppointmentsList appointments={appointments} />
        )}
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 style={{
          color: '#1f2937',
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1.5rem'
        }}>
          Kërko Takim të Ri
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Data
            </label>
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={e => setSelectedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                color: '#1f2937',
                backgroundColor: 'white',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Ora
            </label>
            <select
              value={selectedSlot}
              onChange={e => setSelectedSlot(e.target.value)}
              disabled={!selectedDate || availableSlots.length === 0}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                color: selectedDate && availableSlots.length > 0 ? '#1f2937' : '#9ca3af',
                backgroundColor: 'white',
                cursor: selectedDate && availableSlots.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                if (selectedDate && availableSlots.length > 0) {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">Zgjidhni orën</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {selectedDate && availableSlots.length === 0 && (
              <p style={{
                fontSize: '0.8rem',
                color: '#ef4444',
                marginTop: '0.5rem'
              }}>
                Nuk ka termine të lira për këtë datë
              </p>
            )}
          </div>

          <div style={{ gridColumn: selectedDate ? 'span 1' : 'span 2' }}>
            <label style={{
              display: 'block',
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Shënim (Opsionale)
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Shtoni shënim për takimin..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                color: '#1f2937',
                backgroundColor: 'white',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={() => {
              setSelectedDate('');
              setSelectedSlot('');
              setNote('');
            }}
            disabled={!selectedDate && !selectedSlot && !note}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: !selectedDate && !selectedSlot && !note ? 'not-allowed' : 'pointer',
              opacity: !selectedDate && !selectedSlot && !note ? '0.5' : '1',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedDate || selectedSlot || note) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Pastro
          </button>
          
          <button
            onClick={handleRequestAppointment}
            disabled={!selectedDate || !selectedSlot || submitting}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: !selectedDate || !selectedSlot || submitting ? '#d1d5db' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: !selectedDate || !selectedSlot || submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              if (selectedDate && selectedSlot && !submitting) {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedDate && selectedSlot && !submitting) {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {submitting ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderRadius: '50%',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Po dërgohet...
              </>
            ) : (
              'Kërko Takim'
            )}
          </button>
        </div>

        {selectedDate && availableSlots.length > 0 && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            border: '1px solid #bbf7d0'
          }}>
            <p style={{
              color: '#065f46',
              fontSize: '0.9rem',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>✅</span>
              <span>
                Ka <strong>{availableSlots.length}</strong> termine të lira për {selectedDate}
              </span>
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          
          div[style*="justify-content: flex-end"] {
            flex-direction: column-reverse;
            align-items: stretch !important;
          }
          
          button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserAppointmentsPage;