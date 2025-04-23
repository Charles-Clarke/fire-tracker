import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WardenForm from './WardenForm';
import MapDashboard from './MapDashboard';

const App = () => {
  const [wardens, setWardens] = useState([]);

  const fetchWardens = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/wardens');
      setWardens(response.data);
    } catch (error) {
      console.error('Failed to fetch wardens:', error);
    }
  };

  useEffect(() => {
    fetchWardens();
  }, []);

  return (
    <div className="App">
      <h1>Fire Warden Tracker</h1>

      {/* Form */}
      <WardenForm onWardenAdded={fetchWardens} />

      {/* Table */}
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
                <td>{warden.staff_number}</td>
                <td>{warden.first_name} {warden.last_name}</td>
                <td>{warden.location}</td>
                <td>{new Date(warden.time_logged).toLocaleString()}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Map */}
      <MapDashboard wardens={wardens} />
    </div>
  );
};

export default App;
