// frontend/components/UploadAnalysisForm.js
import React, { useState } from 'react';
import axios from 'axios';

const UploadAnalysisForm = () => {
  const [file, setFile] = useState(null);
  const [requestId, setRequestId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !requestId) return setMessage('All fields are required');

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('request_id', requestId);

    try {
      const res = await axios.post('http://localhost:5000/api/analysis-results/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Appointment Request ID"
        value={requestId}
        onChange={e => setRequestId(e.target.value)}
        required
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={e => setFile(e.target.files[0])}
        required
      />
      <button type="submit">Upload PDF</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UploadAnalysisForm;
