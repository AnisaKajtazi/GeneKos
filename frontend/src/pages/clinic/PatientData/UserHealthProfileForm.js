import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import "../../../styles/formstyles.css";

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      const res = await api.get(`/user-health-profile/user/${patientId}`);
      const profilesArray = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      profilesArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProfiles(profilesArray);
    } catch (err) {
      console.error(err);
      setProfiles([]);
      showMessage("Gabim gjatë marrjes së profileve.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchProfiles();
  }, [patientId]);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
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
    setEditingProfileId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProfileId) {
        await api.put(`/user-health-profile/${editingProfileId}`, profile);
        showMessage("Profili u përditësua me sukses!", "success");
      } else {
        await api.post(`/user-health-profile`, { ...profile, user_id: patientId });
        showMessage("Profili u krijua me sukses!", "success");
      }
      resetForm();
      fetchProfiles();
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë ruajtjes së profilit.", "error");
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
    setEditingProfileId(p.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi ta fshini këtë profil?")) return;

    try {
      await api.delete(`/user-health-profile/${id}`);
      showMessage("Profili u fshi me sukses!", "success");
      fetchProfiles();
    } catch (err) {
      console.error(err);
      showMessage("Gabim gjatë fshirjes së profilit.", "error");
    }
  };

  if (loading) return <p>Po ngarkohet historiku i profileve...</p>;

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Gjatësia (cm)</label>
          <input type="number" name="height" value={profile.height} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label>Pesha (kg)</label>
          <input type="number" name="weight" value={profile.weight} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label>Tipi i Gjakut</label>
          <input type="text" name="blood_type" value={profile.blood_type} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label>Alergjitë</label>
          <textarea name="allergies" value={profile.allergies} onChange={handleChange} className="form-textarea" />
        </div>

        <div className="form-group">
          <label>Sëmundjet/Çrregullimet Mjekësore</label>
          <textarea name="medical_conditions" value={profile.medical_conditions} onChange={handleChange} className="form-textarea" />
        </div>

        <div className="form-group">
          <label>Mjekimet</label>
          <textarea name="medications" value={profile.medications} onChange={handleChange} className="form-textarea" />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {editingProfileId && (
            <button 
              type="button" 
              onClick={resetForm}
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
                e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Anulo
            </button>
          )}
<button 
  type="submit"
  style={{
    padding: '0.5rem 1rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#059669';
    e.currentTarget.style.transform = 'translateY(-1px)';
    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = '#10b981';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
  {editingProfileId ? "Përditëso Profilin" : "Shto Profilin e Ri"}
</button>
        </div>
      </form>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <div className="existing-items">
        <h3>Historiku i Profileve</h3>
        {profiles.length === 0 ? (
          <p>Nuk ka profile të regjistruara për këtë pacient.</p>
        ) : (
          <div className="items-list">
            {profiles.map((p) => (
              <div key={p.id} className="item-card">
                <p><strong>Gjatësia:</strong> {p.height} cm</p>
                <p><strong>Pesha:</strong> {p.weight} kg</p>
                <p><strong>Tipi i Gjakut:</strong> {p.blood_type}</p>
                <p><strong>Alergjitë:</strong> {p.allergies}</p>
                <p><strong>Sëmundjet:</strong> {p.medical_conditions}</p>
                <p><strong>Mjekimet:</strong> {p.medications}</p>
                <p><strong>Krijuar më:</strong> {new Date(p.createdAt).toLocaleString()}</p>
                <p><strong>Përditësuar më:</strong> {new Date(p.updatedAt).toLocaleString()}</p>
                <div className="item-actions" style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <button 
                    onClick={() => handleEdit(p)}
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
                    onClick={() => handleDelete(p.id)}
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
            ))}
          </div>
        )}
      </div>

      <style>{`
        .btn-edit:hover, .btn-delete:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        
        @media (max-width: 768px) {
          .item-actions {
            flex-wrap: wrap;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserHealthProfileForm;