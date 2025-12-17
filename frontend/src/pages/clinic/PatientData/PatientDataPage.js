import React, { useState, useEffect } from "react";
import ActivityForm from "./ActivityForm";
import DietForm from "./DietForm";
import AnalysisResultForm from "./AnalysisResultForm";
import api from '../../../api/axios';
import '../../../styles/patientdatapage.css';

const PatientDataPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );

  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const ActivityCardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );

  const DietCardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M2 12h20" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );

  const AnalysisCardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );

  useEffect(() => {
    if (!searchTerm.trim()) {
      setPatients([]);
      setError("");
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setError("");
      setShowDropdown(true);
      
      try {
        const response = await api.get(`/users?search=${searchTerm}`);
        const activePatients = response.data.filter(patient => patient.is_active !== false);

        if (activePatients.length === 0) {
          setPatients([]);
          setError("Asnjë pacient i gjetur");
        } else {
          setPatients(activePatients);
          setError("");
        }
      } catch (err) {
        console.error(err);
        setError("Gabim në kërkesë");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowDropdown(false);
    setSearchTerm(`${patient.first_name} ${patient.last_name}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedPatient(null);
    if (e.target.value.trim()) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="patient-data-container">
      <header className="page-header">
        <h1 className="page-title">Shto të dhënat e pacientit</h1>
        <p className="page-subtitle">Menaxhoni analizat, aktivitetet dhe dietën e pacientëve</p>
      </header>

      <div className="search-section">
        <div className="search-container">
          <div className="search-box">
            <div className="search-icon">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Shkruaj emrin ose ID e pacientit..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              onFocus={() => searchTerm.trim() && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {loading && (
              <div className="search-loading">
                <div className="spinner"></div>
              </div>
            )}
          </div>

          {showDropdown && patients.length > 0 && (
            <div className="search-results-dropdown">
              <div className="dropdown-header">
                <span className="results-count">
                  {patients.length} pacient{patients.length > 1 ? 'ë' : ''} u gjet{patients.length > 1 ? 'ën' : ''}
                </span>
              </div>
              <div className="dropdown-list">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="patient-result-item"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="patient-result-avatar">
                      <UserIcon />
                    </div>
                    <div className="patient-result-info">
                      <span className="patient-result-name">
                        {patient.first_name} {patient.last_name}
                      </span>
                      <span className="patient-result-id">ID: {patient.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && !showDropdown && (
          <div className="error-message">
            <div className="error-icon">!</div>
            {error}
          </div>
        )}
      </div>

      {selectedPatient && (
        <div className="patient-data-content">
          <div className="patient-info-card">
            <div className="patient-header">
              <div className="patient-avatar large">
                {selectedPatient.first_name?.[0]}{selectedPatient.last_name?.[0]}
              </div>
              <div className="patient-details">
                <h3 className="patient-name">
                  {selectedPatient.first_name} {selectedPatient.last_name}
                </h3>
                <div className="patient-meta">
                  <span className="patient-id">ID: {selectedPatient.id}</span>
                  <span className="patient-status active">Aktiv</span>
                </div>
              </div>
              <button 
                className="clear-patient-btn"
                onClick={() => {
                  setSelectedPatient(null);
                  setSearchTerm("");
                  setPatients([]);
                }}
                title="Zgjidh pacient tjetër"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="forms-single-column">
            <div className="form-card-wide">
              <div className="form-card-header">
                <div className="form-card-title">
                  <div className="form-icon minimal-icon">
                    <AnalysisCardIcon />
                  </div>
                  <span>Analizat</span>
                </div>
                <p className="form-card-description">
                  Vendosni rezultatet e analizave mjekësore
                </p>
              </div>
              <div className="form-card-body">
                <AnalysisResultForm patientId={selectedPatient.id} />
              </div>
            </div>

            <div className="form-card-wide">
              <div className="form-card-header">
                <div className="form-card-title">
                  <div className="form-icon minimal-icon">
                    <ActivityCardIcon />
                  </div>
                  <span>Aktivitetet</span>
                </div>
                <p className="form-card-description">
                  Regjistroni aktivitetet fizike të pacientit
                </p>
              </div>
              <div className="form-card-body">
                <ActivityForm patientId={selectedPatient.id} />
              </div>
            </div>

            <div className="form-card-wide">
              <div className="form-card-header">
                <div className="form-card-title">
                  <div className="form-icon minimal-icon">
                    <DietCardIcon />
                  </div>
                  <span>Dieta</span>
                </div>
                <p className="form-card-description">
                  Përcaktoni planin dietik të pacientit
                </p>
              </div>
              <div className="form-card-body">
                <DietForm patientId={selectedPatient.id} />
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={() => alert("Redirect to Patient Health Profile")}
            >
              Profili i Shëndetit të Pacientit
            </button>
          </div>
        </div>
      )}

      {!selectedPatient && !error && !loading && searchTerm === "" && (
        <div className="empty-state">
          <div className="empty-state-icon minimal-icon">
            <UserIcon />
          </div>
          <h3 className="empty-state-title">Kërkoni një pacient</h3>
          <p className="empty-state-description">
            Shkruani emrin ose ID e pacientit për të filluar të shtoni të dhëna
          </p>
        </div>
      )}

      {!selectedPatient && !error && !loading && searchTerm !== "" && patients.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon minimal-icon">
            <UserIcon />
          </div>
          <h3 className="empty-state-title">Nuk u gjet asnjë pacient</h3>
          <p className="empty-state-description">
            Asnjë pacient nuk u gjet me kërkimin: "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientDataPage;
