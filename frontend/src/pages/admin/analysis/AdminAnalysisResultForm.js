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

  const fetchRequestsForUser = async (user_id) => {
    if (!user_id) {
      setRequests([]);
      return [];
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/appointments/user/${user_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const completedAppointments = (res.data.appointments || res.data || []).filter(
        (r) => r.status === "completed"
      );
      const formatted = completedAppointments.map((r) => ({
        ...r,
        label: `Takimi #${r.id} - ${new Date(r.scheduled_date).toLocaleString()}`,
      }));
      setRequests(formatted);
      return formatted;
    } catch (err) {
      console.error("Error fetching requests:", err);
      setRequests([]);
      return [];
    }
  };

  useEffect(() => {
  const loadEditingData = async () => {
    if (editingResult && users.length > 0) {
      const user_id = editingResult.AppointmentRequest?.user_id || "";
      const request_id = editingResult.request_id || "";
      const analysis_type = editingResult.analysis_type || "";

      const fetchedRequests = await fetchRequestsForUser(user_id);

      const validRequestId = fetchedRequests.some((r) => r.id === request_id)
        ? request_id
        : "";

      setForm({
        user_id,
        request_id: validRequestId,
        analysis_type,
        pdf: null,
      });
    } else if (!editingResult) {
      setForm(emptyForm);
      setRequests([]);
    }
  };

  loadEditingData();
}, [editingResult, users]);

  useEffect(() => {
    if (!editingResult) {
      fetchRequestsForUser(form.user_id).then((fetchedRequests) => {
        if (!fetchedRequests.some((r) => r.id === form.request_id)) {
          setForm((prev) => ({ ...prev, request_id: "" }));
        }
      });
    }
  }, [form.user_id, editingResult]);

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
      <h3>{editingResult ? "Edit Analysis" : "Upload Analysis"}</h3>

      <div style={{ marginBottom: "10px" }}>
        <label>User:</label>
        <select
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Zgjedh Përdoruesin --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.first_name} {u.last_name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Takimi i përfunduar:</label>
        <select
          name="request_id"
          value={form.request_id || ""}
          onChange={handleChange}
          required
        >
          <option value="">-- Zgjedh Takimin --</option>
          {requests.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Lloji i Analizës:</label>
        <input
          type="text"
          name="analysis_type"
          value={form.analysis_type}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>PDF:</label>
        <input
          type="file"
          name="pdf"
          accept="application/pdf"
          onChange={handleChange}
          required={!editingResult}
        />
      </div>

      <button type="submit" style={{ marginRight: "10px" }}>
        {editingResult ? "Update" : "Upload"}
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default AdminAnalysisResultForm;
