import React, { useEffect, useState } from 'react';

const emptyForm = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  role: 'user'
};

const AdminUserForm = ({ editingUser, onSave, onCancel }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingUser) setForm(editingUser);
    else setForm(emptyForm);
  }, [editingUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={submit}>
      <h3>{editingUser ? "Edit User" : "Create User"}</h3>

      <input name="first_name" value={form.first_name} onChange={handleChange} />
      <input name="last_name" value={form.last_name} onChange={handleChange} />
      <input name="username" value={form.username} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
       <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required/>

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="clinic">Clinic</option>
        <option value="user">User</option>
      </select>

      <button type="submit">
        {editingUser ? "Update" : "Create"}
      </button>

      {editingUser && <button onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default AdminUserForm;
