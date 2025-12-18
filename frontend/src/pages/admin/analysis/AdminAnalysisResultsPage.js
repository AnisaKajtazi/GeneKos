import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminAnalysisResultsTable from './AdminAnalysisResultsTable';
import AdminAnalysisResultForm from './AdminAnalysisResultForm';

const AdminAnalysisResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingResult, setEditingResult] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token');

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'http://localhost:5000/api/admin/analysis',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching analysis results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, []);

  const handleSave = async (data) => {
    try {
      const formData = new FormData();
      formData.append("user_id", data.user_id);
      formData.append("request_id", data.request_id);
      formData.append("analysis_type", data.analysis_type);
      if (data.pdf) formData.append("pdf", data.pdf);

      if (editingResult) {
        await axios.put(
          `http://localhost:5000/api/admin/analysis/${editingResult.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/analysis',
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
      }

      setEditingResult(null);
      setShowForm(false);
      fetchResults();
    } catch (err) {
      console.error(err);
      alert("Error saving analysis result");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/analysis/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchResults();
    } catch (err) {
      console.error(err);
      alert("Error deleting analysis result");
    }
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingResult(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Analysis Results</h1>

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
            cursor: "pointer"
          }}
        >
          Upload Analysis Result
        </button>
      )}

      {showForm && (
        <AdminAnalysisResultForm
          editingResult={editingResult}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <AdminAnalysisResultsTable
        results={results}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminAnalysisResultsPage;
