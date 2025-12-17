import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminDietsTable from './AdminDietsTable';
import AdminDietForm from './AdminDietForm';

const AdminDietsPage = () => {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDiet, setEditingDiet] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token');

  const fetchDiets = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/diets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiets(res.data);
    } catch (err) {
      console.error(err);
      alert("Gabim në marrjen e dietave");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiets();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingDiet) {
        await axios.put(
          `http://localhost:5000/api/admin/diets/${editingDiet.id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/diets',
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setEditingDiet(null);
      setShowForm(false);
      fetchDiets();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ruajtjes së dietës");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/diets/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDiets();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë fshirjes së dietës");
    }
  };

  const handleEdit = (diet) => {
    setEditingDiet(diet);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingDiet(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Dietat</h1>

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
          Create Diet
        </button>
      )}

      {showForm && (
        <AdminDietForm
          editingDiet={editingDiet}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <AdminDietsTable
        diets={diets}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminDietsPage;
