const AdminUsersTable = ({ users, loading, onEdit, onDelete }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>First</th>
          <th>Last</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Phone</th>
          <th>Gender</th>
          <th>Date of Birth</th>
          <th>Address</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.length === 0 && (
          <tr>
            <td colSpan="12" style={{ textAlign: 'center' }}>
              No users found
            </td>
          </tr>
        )}

        {users.map(u => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.first_name}</td>
            <td>{u.last_name}</td>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.phone || '-'}</td>
            <td>{u.gender || '-'}</td>
            <td>{u.date_of_birth || '-'}</td>
            <td>{u.address || '-'}</td>
            <td>{u.is_active ? 'Yes' : 'No'}</td>
            <td>
              <button onClick={() => onEdit(u)}>Edit</button>{' '}
              <button onClick={() => onDelete(u.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminUsersTable;
