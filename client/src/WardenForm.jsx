import React, { useState } from 'react';
import axios from 'axios';
import { buildingList } from './constants/buildings';

const API_URL = "https://charlie-fire-warden-aqg9geaqdbcpcpe3.uksouth-01.azurewebsites.net/api";

const WardenForm = ({ onWardenAdded }) => {
  const [staffNumber, setStaffNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!staffNumber || !firstName || !lastName || !location) {
      alert("Please fill in all fields.");
      return;
    }

    console.log("🔄 Submitting warden form...");

    try {
      const response = await axios.post("${API_URL}/wardens", {
        staff_number: staffNumber,
        first_name: firstName,
        last_name: lastName,
        location: location,
      });

      if (response.status === 201) {
        alert("Warden added successfully!");

        // Clear the form
        setStaffNumber('');
        setFirstName('');
        setLastName('');
        setLocation('');

        // Trigger refresh
        onWardenAdded();
      } else {
        console.error("Unexpected server response:", response);
        alert("Unexpected server response.");
      }

    } catch (error) {
      console.error("🔥 Axios error:", error);
      alert("Failed to add fire warden.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Fire Warden</h3>

      <input
        value={staffNumber}
        onChange={(e) => setStaffNumber(e.target.value)}
        placeholder="Staff Number"
      />

      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />

      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />

      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="">Select Location</option>
        {Object.keys(buildingList).map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      <button type="submit">Add Warden</button>
    </form>
  );
};

export default WardenForm;
