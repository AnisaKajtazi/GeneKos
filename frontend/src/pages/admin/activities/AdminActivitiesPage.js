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
      console.error('Gabim në marrjen e aktiviteteve:', err);
      alert('Gabim në marrjen e aktiviteteve');
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
      alert('Gabim gjatë ruajtjes së aktivitetit');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('A je i sigurt?')) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/activities/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchActivities(page, searchTerm);
    } catch (err) {
      console.error(err);
      alert('Gabim gjatë fshirjes së aktivitetit');
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
    <div className="admin-page">

      <div className="admin-header">
        <h1>Aktivitetet</h1>

        <div className="admin-actions">
          <input
            type="text"
            className="admin-search"
            placeholder="Kërko aktivitet..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {!showForm && (
            <button
              className="admin-btn primary"
              onClick={() => setShowForm(true)}
            >
              Create Activity
            </button>
          )}
        </div>
      </div>


      {showForm && (
        <div className="admin-card">
          <AdminActivityForm
            editingActivity={editingActivity}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}


      <div className="admin-card">
        <AdminActivitiesTable
          activities={activities}
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

export default AdminActivitiesPage;
