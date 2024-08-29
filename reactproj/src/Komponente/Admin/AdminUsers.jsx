import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem('auth_token');  
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRoleId) => {
    const token = sessionStorage.getItem('auth_token');
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/admin/users/${userId}/role`,
        { role_id: newRoleId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the role in the local state
      setUsers(users.map(user => (user.id === userId ? { ...user, role_id: newRoleId } : user)));
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = sessionStorage.getItem('auth_token');
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Remove the deleted user from the local state
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user.');
      }
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin - Manage Users</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <select
                  value={user.role_id}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ padding: '5px', borderRadius: '4px' }}
                >
                  <option value="1">Admin</option>
                  <option value="2">Ulogovan</option>
                </select>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleRoleChange(user.id, user.role_id)}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
