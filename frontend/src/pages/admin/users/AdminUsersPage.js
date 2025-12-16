import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import AdminUsersTable from './AdminUsersTable';
import AdminUserForm from './AdminUserForm';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  const token = localStorage.getItem('token');
  const debounceRef = useRef(null);

  const fetchUsers = async (pageNumber = 1, search = '') => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/users?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(res.data.users || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Gabim në marrjen e përdoruesve:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:5000/api/admin/users/${editingUser.id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/users',
          data,
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
    if (!window.confirm('A je i sigurt?')) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(page, searchTerm);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

  
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchUsers(1, value);
    }, 500);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchUsers(newPage, searchTerm);
  };

  return (
    <div>
      <h1>Pacientët</h1>

      <input
        type="text"
        placeholder="Kërko përdorues..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', marginRight: '5px' }}
      />

      {!showForm && (
        <button onClick={handleCreate} style={{ marginBottom: '10px' }}>
          Create User
        </button>
      )}

      {showForm && (
        <AdminUserForm
          editingUser={editingUser}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <AdminUsersTable
        users={Array.isArray(users) ? users : []}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>

        <span style={{ margin: '0 10px' }}>
          Page {page} of {totalPages}
        </span>

        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUsersPage;
