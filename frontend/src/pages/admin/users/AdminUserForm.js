import React, { useEffect, useState } from 'react';

const emptyForm = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  role: 'user',
  phone: '',
  gender: '',
  date_of_birth: '',
  address: '',
  is_active: true
};

const AdminUserForm = ({ editingUser, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    if (editingUser) {
      setForm({
        first_name: editingUser.first_name || '',
        last_name: editingUser.last_name || '',
        username: editingUser.username || '',
        email: '', 
        password: '',
        role: 'user', 
        phone: editingUser.phone || '',
        gender: editingUser.gender || '',
        date_of_birth: editingUser.date_of_birth || '',
        address: editingUser.address || '',
        is_active: editingUser.is_active !== undefined ? editingUser.is_active : true
      });
    } else {
      setForm({ ...emptyForm });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    if (!editingUser) setForm({ ...emptyForm });
  };

  const handleCancel = () => {
    setForm({ ...emptyForm });
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>{editingUser ? 'Edit User' : 'Create User'}</h3>

      <input
        name="first_name"
        placeholder="First name"
        value={form.first_name}
        onChange={handleChange}
        required
      />

      <input
        name="last_name"
        placeholder="Last name"
        value={form.last_name}
        onChange={handleChange}
        required
      />

      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        autoComplete="new-username"
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        autoComplete="new-email"
      />

      <input
        type="password"
        name="password"
        placeholder={editingUser ? 'New password (optional)' : 'Password'}
        value={form.password}
        onChange={handleChange}
        required={!editingUser}
        autoComplete="new-password"
      />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="clinic">Clinic</option>
        <option value="admin">Admin</option>
      </select>

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />

      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="">-- Gender --</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <input
        type="date"
        name="date_of_birth"
        value={form.date_of_birth}
        onChange={handleChange}
      />

      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
      />

      <label>
        Active:
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />
      </label>

      <div style={{ marginTop: '10px' }}>
        <button type="submit">{editingUser ? 'Update' : 'Create'}</button>
        <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminUserForm;
