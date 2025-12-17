import React, { useEffect, useState } from "react";
import axios from "axios";

const emptyForm = {
  user_id: "",
  request_id: "",
  diet_plan: "",
  analysis_id: "",
};

const AdminDietForm = ({ editingDiet, onSave, onCancel }) => {
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
    if (editingDiet) setForm(editingDiet);
    else setForm(emptyForm);
  }, [editingDiet]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: "20px" }}>
      <h3>{editingDiet ? "Edit Diet" : "Create Diet"}</h3>

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
        <label>Diet Plan:</label>
        <textarea
          name="diet_plan"
          placeholder="Diet plan"
          value={form.diet_plan}
          onChange={handleChange}
          required
          style={{ width: "100%", minHeight: "60px" }}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button type="submit" style={{ marginRight: "10px" }}>
          {editingDiet ? "Update" : "Create"}
        </button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default AdminDietForm;
