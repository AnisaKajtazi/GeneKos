import React, { useEffect, useState } from 'react';

const emptyForm = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  phone: '',
  gender: '',
  date_of_birth: '',
  address: '',
  is_active: true
};

const ClinicUserForm = ({ editingUser, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    if (editingUser) {
      setForm({
        first_name: editingUser.first_name || '',
        last_name: editingUser.last_name || '',
        username: editingUser.username || '',
        email: editingUser.email || '',
        password: '',
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

  return (
    <div className="clinic-user-form">
      <div className="form-header">
        <h3 className="form-title">
          {editingUser ? 'Edit Patient' : 'Create New Patient'}
        </h3>
        <button 
          type="button" 
          className="close-btn"
          onClick={onCancel}
          aria-label="Close form"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="first_name" className="required">Emri</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              placeholder="Enter first name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name" className="required">Mbiemri</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              placeholder="Enter last name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="required">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="required">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className={!editingUser ? 'required' : ''}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
              value={form.password}
              onChange={handleChange}
              required={!editingUser}
              minLength={editingUser ? 0 : 6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Nr. Tel</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gjinia</label>
            <select
              id="gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Selekto Gjininë</option>
              <option value="male">Mashkull</option>
              <option value="female">Femër</option>
              <option value="other">Tjetër</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date_of_birth">Data e Lindjes</label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="address">Adresa</label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter full address"
              value={form.address}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="checkbox-group">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
          />
          <label htmlFor="is_active">Pacienti është aktiv</label>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            {editingUser ? 'Update Patient' : 'Create Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClinicUserForm;