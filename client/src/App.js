import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WardenForm from './WardenForm';
import MapDashboard from './MapDashboard';
import LoginPage from './LoginPage';
import UserManagement from './UserManagement';
import { buildingList } from './constants/buildings';

const App = () => {
  const [wardens, setWardens] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    staff_number: '',
    first_name: '',
    last_name: '',
    location: ''
  });
  const [role, setRole] = useState(sessionStorage.getItem('role') || '');

  const fetchWardens = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wardens');
      setWardens(response.data);
    } catch (error) {
      console.error('Failed to fetch wardens:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this warden?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/wardens/${id}`);
      fetchWardens();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete warden.");
    }
  };

  const handleEditClick = (warden) => {
    setEditId(warden.id);
    setEditData({
      staff_number: warden.staff_number,
      first_name: warden.first_name,
      last_name: warden.last_name,
      location: warden.location
    });
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/wardens/${id}`, editData);
      setEditId(null);
      fetchWardens();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update warden.");
    }
  };

  useEffect(() => {
    if (role) {
      fetchWardens();
    }
  }, [role]);

  const handleLogout = () => {
    sessionStorage.removeItem('role');
    setRole('');
  };

  if (!role) {
    return <LoginPage onLogin={setRole} />;
  }

  return (
    <div className="App">
      <h1>Fire Warden Tracker</h1>

      <button onClick={handleLogout} style={{ marginBottom: '20px', backgroundColor: '#e60000', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
        Logout
      </button>

      {/* Warden View */}
      {role === 'warden' && (
        <>
          <WardenForm onWardenAdded={fetchWardens} />
          <MapDashboard wardens={wardens} key={JSON.stringify(wardens)} />
        </>
      )}

      {/* Admin View */}
      {role === 'admin' && (
        <>
          <h2>All Fire Wardens</h2>
          <table>
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
              {wardens.length === 0 ? (
                <tr><td colSpan="5">No records found.</td></tr>
              ) : (
                wardens.map((warden) => (
                  <tr key={warden.id}>
                    {editId === warden.id ? (
                      <>
                        <td>
                          <input
                            name="staff_number"
                            value={editData.staff_number}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            name="first_name"
                            value={editData.first_name}
                            onChange={handleEditChange}
                            placeholder="First"
                          />
                          <input
                            name="last_name"
                            value={editData.last_name}
                            onChange={handleEditChange}
                            placeholder="Last"
                          />
                        </td>
                        <td>
                          <select
                            name="location"
                            value={editData.location}
                            onChange={handleEditChange}
                          >
                            <option value="">Select Location</option>
                            {Object.keys(buildingList).map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </td>
                        <td>{new Date(warden.time_logged).toLocaleString()}</td>
                        <td>
                          <button onClick={() => handleSave(warden.id)}>Save</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{warden.staff_number}</td>
                        <td>{warden.first_name} {warden.last_name}</td>
                        <td>{warden.location}</td>
                        <td>{new Date(warden.time_logged).toLocaleString()}</td>
                        <td>
                          <button onClick={() => handleEditClick(warden)}>Edit</button>
                          <button onClick={() => handleDelete(warden.id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ✅ Admin-only: User management */}
          <UserManagement />

          {/* Map */}
          <MapDashboard wardens={wardens} key={JSON.stringify(wardens)} />
        </>
      )}
    </div>
  );
};

export default App;
