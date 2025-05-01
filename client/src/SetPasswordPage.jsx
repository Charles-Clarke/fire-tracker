import React, { useState } from 'react';
import axios from 'axios';

const SetPasswordPage = ({ username, onComplete }) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setError("Passwords don't match");
      return;
    }

    const username = sessionStorage.getItem('username');
    try {
      await axios.post('http://localhost:5000/api/set-password', {
        username: sessionStorage.getItem('username'),
        password: newPass
      });
      alert('Password set! Please log in.');
      sessionStorage.removeItem('username');
      onComplete(); // Go back to login
    } catch (err) {
      console.error('Set password error:', err);
      setError('Failed to set password');
    }
  };

  return (
    <div className="login-page">
      <h2>Set Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        />
        <br />
        <button type="submit">Set Password</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SetPasswordPage;
