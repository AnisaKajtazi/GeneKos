import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminActivitiesTable from './AdminActivitiesTable';
import AdminActivityForm from './AdminActivityForm';

const AdminActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'http://localhost:5000/api/admin/activities',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivities(res.data);
    } catch {
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
      fetchActivities();
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
      fetchActivities();
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

  return (
    <div>
      <h1>Aktivitetet</h1>


      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            marginBottom: "15px",
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
    </div>
  );
};

export default AdminActivitiesPage;
