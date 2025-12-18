import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import AdminDietsTable from './AdminDietsTable';
import AdminDietForm from './AdminDietForm';

const AdminDietsPage = () => {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDiet, setEditingDiet] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  const token = localStorage.getItem('token');
  const debounceRef = useRef(null);

  const fetchDiets = async (pageNumber = 1, search = '') => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/diets?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiets(res.data.diets || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching diets:", err);
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
          `http://localhost:5000/api/diets/${editingDiet.id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/diets',
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setEditingDiet(null);
      setShowForm(false);
      fetchDiets(page, searchTerm);
    } catch (err) {
      console.error(err);
      alert("Error saving diet");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/diets/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDiets(page, searchTerm);
    } catch (err) {
      console.error(err);
      alert("Error deleting diet");
    }
  };

  const handleEdit = (diet) => {
    setEditingDiet(diet);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingDiet(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingDiet(null);
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchDiets(1, value);
    }, 500);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchDiets(newPage, searchTerm);
  };

  return (
    <div>
      <h1>Diets</h1>

      <input
        type="text"
        placeholder="Search by user or diet plan..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', marginRight: '5px' }}
      />

      {!showForm && (
        <button
          onClick={handleCreate}
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
          Create Diet
        </button>
      )}

      {showForm && (
        <AdminDietForm editingDiet={editingDiet} onSave={handleSave} onCancel={handleCancel} />
      )}

      <AdminDietsTable
        diets={Array.isArray(diets) ? diets : []}
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

export default AdminDietsPage;
