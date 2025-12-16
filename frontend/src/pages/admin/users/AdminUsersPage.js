import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminUsersTable from './AdminUsersTable';
import AdminUserForm from './AdminUserForm';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'http://localhost:5000/api/admin/users',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data);
    } catch (err) {
      alert("Gabim në marrjen e përdoruesve");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (data) => {
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
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt?")) return;
    await axios.delete(
      `http://localhost:5000/api/admin/users/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchUsers();
  };

  return (
    <div>
      <h1>Pacientët</h1>

      <AdminUserForm
        editingUser={editingUser}
        onSave={handleSave}
        onCancel={() => setEditingUser(null)}
      />

      <AdminUsersTable
        users={users}
        loading={loading}
        onEdit={setEditingUser}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminUsersPage;
