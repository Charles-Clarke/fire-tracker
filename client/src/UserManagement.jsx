import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "https://charlie-fire-warden-aqg9geaqdbcpcpe3.uksouth-01.azurewebsites.net/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newUser, setNewUser] = useState({
    username: '',
    full_name: '',
    email: '',
    staff_number: '',
    password: '',
    role: 'warden',
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete user.');
    }
  };

  const handleAddChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
  
    const payload = {
      username: newUser.username,
      full_name: newUser.full_name,
      email: newUser.email,
      staff_number: newUser.staff_number,
      role: newUser.role
    };
  
    // Only include password if it’s been set (e.g. for admin accounts)
    if (newUser.password && newUser.password.trim() !== '') {
      payload.password = newUser.password;
    }
  
    try {
      await axios.post(`${API_URL}/users`, payload);
      setNewUser({
        username: '',
        full_name: '',
        email: '',
        staff_number: '',
        password: '',
        role: 'warden',
      });
      fetchUsers();
    } catch (err) {
      console.error('Add user failed:', err);
      alert('Failed to add user.');
    }
  };
  

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditData({ ...user });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_URL}/users/${editingId}`, editData);
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User Management</h2>

      <h3>Add New User</h3>
      <form onSubmit={handleAddUser}>
        <input name="username" placeholder="Username" value={newUser.username} onChange={handleAddChange} required />
        <input name="full_name" placeholder="Full Name" value={newUser.full_name} onChange={handleAddChange} required />
        <input name="email" placeholder="Email" value={newUser.email} onChange={handleAddChange} required />
        <input name="staff_number" placeholder="Staff Number" value={newUser.staff_number} onChange={handleAddChange} required />
        <select name="role" value={newUser.role} onChange={handleAddChange}>
          <option value="warden">Warden</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <h3>Existing Users</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Staff Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="6">No users found.</td></tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                {editingId === user.id ? (
                  <>
                    <td><input name="full_name" value={editData.full_name} onChange={handleEditChange} /></td>
                    <td><input name="email" value={editData.email} onChange={handleEditChange} /></td>
                    <td><input name="staff_number" value={editData.staff_number} onChange={handleEditChange} /></td>
                    <td>
                      <select name="role" value={editData.role} onChange={handleEditChange}>
                        <option value="warden">Warden</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.staff_number}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleEditClick(user)}>Edit</button>
                      <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
