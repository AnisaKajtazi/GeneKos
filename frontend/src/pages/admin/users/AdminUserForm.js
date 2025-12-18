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
        role: editingUser.role || 'user', 
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
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3 className="admin-form-title">{editingUser ? 'Edit User' : 'Create User'}</h3>

      <div className="admin-form-grid">
        <div className="admin-form-group">
          <label>First Name:</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Last Name:</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Username:</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Email:</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder={editingUser ? 'New password (optional)' : 'Password'}
            value={form.password}
            onChange={handleChange}
            required={!editingUser}
          />
        </div>

        <div className="admin-form-group">
          <label>Role:</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="clinic">Clinic</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="admin-form-group">
          <label>Phone:</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="admin-form-group">
          <label>Gender:</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">-- Gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="admin-form-group">
          <label>Date of Birth:</label>
          <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
        </div>

        <div className="admin-form-group full">
          <label>Address:</label>
          <input name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className="admin-form-group full">
          <label>
            Active:
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              style={{ marginLeft: '5px' }}
            />
          </label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn primary">
          {editingUser ? 'Update' : 'Create'}
        </button>
        <button type="button" className="admin-btn secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminUserForm;
