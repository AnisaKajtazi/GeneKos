import React from 'react';

const ClinicUsersTable = ({ users, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="clinic-users-table-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="clinic-users-table-container">
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h4 className="empty-title">No Patients Found</h4>
          <p className="empty-message">
            No patients are registered yet. Click "Add Patient" to create your first patient record.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPhone = (phone) => {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="clinic-users-table-container">
      <div style={{ overflowX: 'auto' }}>
        <table className="clinic-users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Address</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>#{user.id.toString().slice(-8)}</td>
                <td>{user.first_name || '-'}</td>
                <td>{user.last_name || '-'}</td>
                <td>{user.username || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>{formatPhone(user.phone)}</td>
                <td>
                  {user.gender === 'male' ? 'Male' : 
                   user.gender === 'female' ? 'Female' : 
                   user.gender === 'other' ? 'Other' : '-'}
                </td>
                <td>{formatDate(user.date_of_birth)}</td>
                <td className="text-truncate" title={user.address || ''}>
                  {user.address || '-'}
                </td>
                <td>
                  <span className={`active-status ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions-cell">
                  <div className="actions-container">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => onEdit(user)}
                      aria-label={`Edit ${user.first_name} ${user.last_name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => onDelete(user.id)}
                      aria-label={`Delete ${user.first_name} ${user.last_name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClinicUsersTable;