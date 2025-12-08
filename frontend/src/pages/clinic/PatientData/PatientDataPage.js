import React, { useState } from "react";
import ActivityForm from "./ActivityForm";
import DietForm from "./DietForm";
import api from '../../../api/axios';

const PatientDataPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setError("");
    try {

      const response = await api.get(`/users?search=${searchTerm}`);
      if (response.data.length === 0) {
        setError("Pacient i pa gjetur");
        setSelectedPatient(null);
      } else {
        setSelectedPatient(response.data[0]);
      }
    } catch (err) {
      console.error(err);
      setError("Gabim në kërkesë");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Shto të dhënat e pacientit</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Shkruaj emrin ose ID e pacientit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "250px", marginRight: "10px" }}
        />
        <button onClick={handleSearch} style={{ padding: "8px 15px" }}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {selectedPatient && (
        <div>
          <h3>
            Pacienti: {selectedPatient.first_name} {selectedPatient.last_name}
          </h3>

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
                width: "300px",
              }}
            >
              <h4>Aktivitetet</h4>
              <ActivityForm patientId={selectedPatient.id} />
            </div>

            <div
  style={{
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    width: "300px"
  }}
>
  <h4>Dieta</h4>
  <DietForm patientId={selectedPatient.id} />
</div>

          </div>

          <div style={{ marginTop: "20px" }}>
            <button
              style={{ padding: "8px 12px" }}
              onClick={() => alert("Redirect to Patient Health Profile")}
            >
              Patient Health Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDataPage;
