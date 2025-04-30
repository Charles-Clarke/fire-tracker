import React, { useState } from 'react';
import axios from 'axios';
import './App.css';


const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
  
      if (response.data.role) {
        sessionStorage.setItem('role', response.data.role);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('staff_number', response.data.staff_number || '');
        sessionStorage.setItem('first_name', response.data.first_name || '');
        sessionStorage.setItem('last_name', response.data.last_name || '');
        sessionStorage.setItem('full_name', response.data.full_name)
        onLogin(response.data.role);
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password.');
    }
  };
  

  return (
    <div className="login-page">
      <h2>Fire Warden Tracker Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
