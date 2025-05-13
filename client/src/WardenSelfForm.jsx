import React, { useState } from 'react';
import axios from 'axios';
import { buildingList } from './constants/buildings';
import './App.css';

const API_URL = "https://charlie-fire-warden-aqg9geaqdbcpcpe3.uksouth-01.azurewebsites.net/api";

const WardenSelfForm = ({ refreshWardens }) => {
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const staff_number = sessionStorage.getItem('staff_number');
  const first_name = sessionStorage.getItem('first_name');
  const last_name = sessionStorage.getItem('last_name');

  console.log({ staff_number, first_name, last_name }); // TEMP debug


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert('Please select your location.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/wardens`, {
        staff_number,
        first_name,
        last_name,
        location
      });

      if (response.status === 201 || response.status === 200) {
        setMessage('✅ Your location has been logged!');
        if (refreshWardens) refreshWardens();
      } else {
        setMessage('❌ Failed to log location.');
      }
    } catch (err) {
      console.error('Error submitting location:', err);
      setMessage('❌ Something went wrong.');
    }
  };

  return (
    <div>
      <h2>Log Your Location</h2>
      <form onSubmit={handleSubmit}>
        <label>Select your current location:</label><br />
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select Location</option>
          {Object.keys(buildingList).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <br /><br />
        <button type="submit">Update Location</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default WardenSelfForm;
