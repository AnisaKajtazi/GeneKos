const AdminUsersTable = ({ users, loading, onEdit, onDelete }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>First</th>
          <th>Last</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.first_name}</td>
            <td>{u.last_name}</td>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>
              <button onClick={() => onEdit(u)}>Edit</button>
              <button onClick={() => onDelete(u.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminUsersTable;
