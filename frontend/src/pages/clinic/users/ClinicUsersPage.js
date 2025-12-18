import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ClinicUsersTable from './ClinicUsersTable';
import ClinicUserForm from './ClinicUserForm';
import '../../../styles/clinicUsers.css';

const ClinicUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');
  const debounceRef = useRef(null);

  const fetchUsers = async (pageNumber = 1, search = '') => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/clinic/users?page=${pageNumber}&search=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(res.data.users || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
      setTotalUsers(res.data.totalUsers || res.data.users.length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (data) => {
    const payload = {
      ...data,
      role: 'user'
    };

    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:5000/api/clinic/users/${editingUser.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/clinic/users`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setEditingUser(null);
      setShowForm(false);
      fetchUsers(page, searchTerm);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/clinic/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(page, searchTerm);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchUsers(1, value);
    }, 500);
  };

  const clinicUsers = users.map(({ role, ...rest }) => rest);

const filteredUsers = clinicUsers.filter((user) => {
  const term = searchTerm.toLowerCase();
  return (
    user.first_name.toLowerCase().includes(term) ||
    user.last_name.toLowerCase().includes(term) ||
    user.username.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term) ||
    (user.phone || '').toLowerCase().includes(term) ||
    (user.gender || '').toLowerCase().includes(term) ||
    (user.date_of_birth || '').toLowerCase().includes(term) ||
    (user.address || '').toLowerCase().includes(term) ||
    (user.id + '').includes(term)
  );
});


  return (
    <div className="clinic-users-page">
      <div className="page-header">
        <h1>Menaxhimi i Pacientëve</h1>
        <p className="page-subtitle">
          Menaxho të gjithë pacientët e klinikës tënde në një vend. 
          Shto pacientë të rinj, përditëso të dhënat ekzistuese, ose kërko për pacientë të veçantë.
        </p>
      </div>

      <div className="controls-container">
        <div className="search-wrapper">
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search patients by name, email, phone, or ID..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {!showForm && (
          <button className="add-patient-btn" onClick={() => setShowForm(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Shto Pacient
          </button>
        )}
      </div>

      <div className="stats-card">
        <div className="stats-indicator"></div>
        <p className="stats-text">
          Duke treguar <strong>{filteredUsers.length}</strong> nga <strong>{totalUsers}</strong> pacientë
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {showForm && (
        <ClinicUserForm
          editingUser={editingUser}
          onSave={handleSave}
          onCancel={() => {
            setEditingUser(null);
            setShowForm(false);
          }}
        />
      )}

      <ClinicUsersTable
        users={filteredUsers}
        loading={loading}
        onEdit={(user) => {
          setEditingUser(user);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => fetchUsers(page - 1, searchTerm)}
            disabled={page === 1}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Para
          </button>

          <div className="pagination-info">
            <span>Faqja</span>
            <span className="pagination-current">{page}</span>
            <span>nga {totalPages}</span>
          </div>

          <button
            className="pagination-btn"
            onClick={() => fetchUsers(page + 1, searchTerm)}
            disabled={page === totalPages}
          >
            Pas
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ClinicUsersPage;
