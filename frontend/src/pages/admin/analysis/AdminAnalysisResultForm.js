import React, { useEffect, useState } from "react";
import axios from "axios";

const emptyForm = {
  user_id: "",
  request_id: "",
  analysis_type: "",
  pdf: null,
};

const AdminAnalysisResultForm = ({ editingResult, onSave, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, [token]);


  useEffect(() => {
    const fetchRequests = async () => {
      if (!form.user_id) {
        setRequests([]);
        setForm((prev) => ({ ...prev, request_id: "" }));
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/appointments/user/${form.user_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const completedAppointments = (res.data.appointments || res.data || []).filter(
          (r) => r.status === "completed"
        );

        const formattedRequests = completedAppointments.map((r) => ({
          ...r,
          label: `Appointment ${r.id} - ${new Date(r.scheduled_date).toLocaleString()}`,
        }));

        setRequests(formattedRequests);

        if (!formattedRequests.some((r) => r.id === form.request_id)) {
          setForm((prev) => ({ ...prev, request_id: "" }));
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
        setRequests([]);
      }
    };

    fetchRequests();
  }, [form.user_id, token]);


  useEffect(() => {
    if (editingResult) setForm(editingResult);
    else setForm(emptyForm);
  }, [editingResult]);

  const handleChange = (e) => {
    if (e.target.name === "pdf") {
      setForm({ ...form, pdf: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: "20px" }}>
      <h3>{editingResult ? "Edit Analysis Result" : "Upload Analysis Result"}</h3>

      <div style={{ marginBottom: "10px" }}>
        <label>User:</label>
        <select
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Select User --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.first_name} {u.last_name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Appointment Request:</label>
        <select
          name="request_id"
          value={form.request_id || ""}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Completed Appointment --</option>
          {requests.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Analysis Type:</label>
        <input
          type="text"
          name="analysis_type"
          value={form.analysis_type}
          onChange={handleChange}
          placeholder="Analysis type"
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>PDF File:</label>
        <input
          type="file"
          name="pdf"
          accept="application/pdf"
          onChange={handleChange}
          required={!editingResult}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button type="submit" style={{ marginRight: "10px" }}>
          {editingResult ? "Update" : "Upload"}
        </button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default AdminAnalysisResultForm;
