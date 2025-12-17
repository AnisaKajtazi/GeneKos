import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminAuditLogsTable from './AdminAuditLogsTable';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'http://localhost:5000/api/admin/audit-logs',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs(res.data);
    } catch (err) {
      alert("Gabim në marrjen e audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Audit Logs</h1>
      <AdminAuditLogsTable logs={logs} loading={loading} />
    </div>
  );
};

export default AdminAuditLogsPage;
