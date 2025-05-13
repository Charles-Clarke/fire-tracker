import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [wardens, setWardens] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    staff_number: '',
    first_name: '',
    last_name: '',
    location: ''
  });

  useEffect(() => {
    fetchWardens();
  }, []);

  const API_URL = "https://charlie-fire-warden-aqg9geaqdbcpcpe3.uksouth-01.azurewebsites.net/api";

  const fetchWardens = async () => {
    try {
      const res = await axios.get(`${API_URL}/wardens`);
      setWardens(res.data);
    } catch (err) {
      console.error('Error fetching wardens:', err);
    }
  };

  const deleteWarden = async (id) => {
    try {
      await axios.delete(`${API_URL}/wardens/${id}`);
      fetchWardens();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete warden');
    }
  };

  const startEditing = (warden) => {
    setEditId(warden.id);
    setEditFormData({
      staff_number: warden.staff_number,
      first_name: warden.first_name,
      last_name: warden.last_name,
      location: warden.location
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/wardens/${id}`, editFormData);
      setEditId(null);
      fetchWardens();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update warden');
    }
  };

  return (
    <div>
      <h2>All Fire Wardens</h2>
      {wardens.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Staff Number</th>
              <th>Name</th>
              <th>Location</th>
              <th>Time Logged</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wardens.map((w) => (
              <tr key={w.id}>
                {editId === w.id ? (
                  <>
                    <td>
                      <input
                        name="staff_number"
                        value={editFormData.staff_number}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        name="first_name"
                        value={editFormData.first_name}
                        onChange={handleEditChange}
                        placeholder="First"
                      />
                      <input
                        name="last_name"
                        value={editFormData.last_name}
                        onChange={handleEditChange}
                        placeholder="Last"
                      />
                    </td>
                    <td>
                      <input
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>{new Date(w.timestamp).toLocaleString()}</td>
                    <td>
                      <button onClick={() => saveEdit(w.id)}>Save</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{w.staff_number}</td>
                    <td>{w.first_name} {w.last_name}</td>
                    <td>{w.location}</td>
                    <td>{new Date(w.timestamp).toLocaleString()}</td>
                    <td>
                      <button onClick={() => startEditing(w)}>Edit</button>
                      <button onClick={() => deleteWarden(w.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
