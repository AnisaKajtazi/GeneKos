import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminAnalysisResultsTable from "./AdminAnalysisResultsTable";
import AdminAnalysisResultForm from "./AdminAnalysisResultForm";

const AdminAnalysisResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingResult, setEditingResult] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const token = localStorage.getItem("token");
  const debounceRef = useRef(null);

  const fetchResults = async (pageNumber = 1, search = "") => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/analysis?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults(res.data.analysisResults || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Gabim në marrjen e analizave:", err);
      alert("Gabim në marrjen e analizave");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSave = async (data) => {
    try {
      const formData = new FormData();
      formData.append("request_id", data.request_id);
      formData.append("analysis_type", data.analysis_type);
      if (data.pdf) formData.append("pdf", data.pdf);

      if (editingResult) {
        await axios.put(
          `http://localhost:5000/api/admin/analysis/${editingResult.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/admin/analysis", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setEditingResult(null);
      setShowForm(false);
      fetchResults(1, searchTerm);
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ruajtjes së analizës");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/analysis/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResults(page, searchTerm);
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë fshirjes së analizës");
    }
  };

  const handleEdit = (result) => {
    setEditingResult({
      id: result.id,
      request_id: result.request_id,
      analysis_type: result.analysis_type,
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingResult(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingResult(null);
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchResults(1, value);
    }, 500);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchResults(newPage, searchTerm);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Analizat</h1>
        <div className="admin-actions">
          <input
            type="text"
            className="admin-search"
            placeholder="Kërko analizë ose pacient..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {!showForm && (
            <button className="admin-btn primary" onClick={handleCreate}>
              Upload Analizat
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="admin-card">
          <AdminAnalysisResultForm
            editingResult={editingResult}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="admin-card">
        <AdminAnalysisResultsTable
          results={Array.isArray(results) ? results : []}
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
          Para
        </button>

        <span>
          Faqja {page} nga {totalPages}
        </span>

        <button
          className="admin-btn"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Pas
        </button>
      </div>
    </div>
  );
};

export default AdminAnalysisResultsPage;
