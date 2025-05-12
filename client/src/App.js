import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapDashboard from './MapDashboard';
import LoginPage from './LoginPage';
import UserManagement from './UserManagement';
import { buildingList } from './constants/buildings';
import WardenSelfForm from './WardenSelfForm';
import SetPasswordPage from './SetPasswordPage';
import './App.css';

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
  const [setupUser, setSetupUser] = useState('');

useEffect(() => {
  if (!role) {
    // Only apply background on login page
    document.body.style.background = `url(${process.env.PUBLIC_URL}/West-Downs-Web-copy.jpg) no-repeat center center fixed`;
    document.body.style.backgroundSize = 'cover';
  } else {
    // Remove background when logged in
    document.body.style.background = '';
    document.body.style.backgroundSize = '';
  }

  return () => {
    // Cleanup when component unmounts
    document.body.style.background = '';
    document.body.style.backgroundSize = '';
  };
}, [role]);


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
    if (role === 'admin' || role.toLowerCase() === 'warden') {
      fetchWardens();
    }
  }, [role]);

  const handleLogout = () => {
    sessionStorage.clear();
    setRole('');
    setSetupUser('');
  };

  // ✅ First-time password setup
  if (!role) {
    return <LoginPage onLogin={(r, u) => {
      if (r === 'set-password') {
        setSetupUser(u);
        setRole('set-password');
      } else {
        setRole(r);
      }
    }} />;
  }

  if (role === 'set-password') {
    return <SetPasswordPage username={setupUser} onComplete={() => setRole('')} />;
  }


  return (
    <div className="App">
      <h1>Fire Warden Tracker</h1>

      <button
        onClick={handleLogout}
        style={{
          marginBottom: '20px',
          backgroundColor: '#e60000',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>

      {/* Warden View */}
      {role.toLowerCase() === 'warden' && (
        <>
          <WardenSelfForm refreshWardens={fetchWardens} />
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
                            name="full_name"
                            value={editData.full_name}
                            onChange={handleEditChange}
                            placeholder="Full name"
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
                        <td>{warden.full_name}</td>
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

          <UserManagement />
          <MapDashboard wardens={wardens} key={JSON.stringify(wardens)} />
        </>
      )}
    </div>
  );
};

export default App;
