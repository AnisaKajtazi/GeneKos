import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminUsersTable from "./AdminUsersTable";
import AdminUserForm from "./AdminUserForm";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const token = localStorage.getItem("token");
  const debounceRef = useRef(null);

  const fetchUsers = async (pageNumber = 1, search = "") => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/users?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data.users || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching users:", err);
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
        await axios.post("http://localhost:5000/api/admin/users", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setEditingUser(null);
      setShowForm(false);
      fetchUsers(page, searchTerm);
    } catch (err) {
      console.error(err);
      alert("Error saving user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(page, searchTerm);
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
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
    <div className="admin-page">
      <div className="admin-header">
        <h1>Përdoruesit</h1>

        <div className="admin-actions">
          <input
            type="text"
            className="admin-search"
            placeholder="Kërko përdorues..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {!showForm && (
            <button className="admin-btn primary" onClick={handleCreate}>
              Create User
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="admin-card">
          <AdminUserForm
            editingUser={editingUser}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="admin-card">
        <AdminUsersTable
          users={Array.isArray(users) ? users : []}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <div className="admin-pagination">
        <button
          className="admin-btn"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="admin-btn"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUsersPage;
