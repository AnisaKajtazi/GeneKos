import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import AdminActivitiesTable from './AdminActivitiesTable';
import AdminActivityForm from './AdminActivityForm';

const AdminActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  const token = localStorage.getItem('token');
  const debounceRef = useRef(null);

  const fetchActivities = async (pageNumber = 1, search = '') => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/activities?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActivities(res.data.activities || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Gabim në marrjen e aktiviteteve:", err);
      alert("Gabim në marrjen e aktiviteteve");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingActivity) {
        await axios.put(
          `http://localhost:5000/api/admin/activities/${editingActivity.id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/activities',
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setEditingActivity(null);
      setShowForm(false);
      fetchActivities(page, searchTerm);
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ruajtjes së aktivitetit");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/activities/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchActivities(page, searchTerm);
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë fshirjes së aktivitetit");
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingActivity(null);
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchActivities(1, value);
    }, 500);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchActivities(newPage, searchTerm);
  };

  return (
    <div>
      <h1>Aktivitetet</h1>

      <input
        type="text"
        placeholder="Kërko aktivitet..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', marginRight: '5px' }}
      />

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            marginBottom: "10px",
            padding: "6px 12px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Activity
        </button>
      )}

      {showForm && (
        <AdminActivityForm
          editingActivity={editingActivity}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <AdminActivitiesTable
        activities={activities}
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

export default AdminActivitiesPage;
