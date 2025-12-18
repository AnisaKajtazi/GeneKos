import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import AdminAuditLogsTable from './AdminAuditLogsTable';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  const token = localStorage.getItem('token');
  const debounceRef = useRef(null);

  const fetchLogs = async (pageNumber = 1, search = '') => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/audit-logs?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(search)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLogs(res.data.logs || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Gabim në marrjen e audit logs:", err);
      alert("Gabim në marrjen e audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do ta fshish këtë log?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/audit-logs/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLogs(page, searchTerm);
    } catch (err) {
      console.error("Gabim gjatë fshirjes së audit log:", err);
      alert("Gabim gjatë fshirjes së audit log");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchLogs(1, value);
    }, 500);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchLogs(newPage, searchTerm);
  };

  return (
    <div>
      <h1>Audit Logs</h1>

      <input
        type="text"
        placeholder="Kërko audit logs..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', marginRight: '5px' }}
      />

      <AdminAuditLogsTable
        logs={Array.isArray(logs) ? logs : []}
        loading={loading}
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

export default AdminAuditLogsPage;
