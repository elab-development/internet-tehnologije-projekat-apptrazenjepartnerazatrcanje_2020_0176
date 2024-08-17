import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import PoljeZaUnos from './PoljeZaUnos';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    email: 'marcel.pagac@example.net',
    password: 'password',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
      const token = response.data.access_token;

      // Sačuvaj token u session storage-u
      sessionStorage.setItem('auth_token', token);

      // Postavi token u App.js
      setToken(token);

      // Postavi poruku o uspehu i izbriši greške
      setSuccessMessage('Login successful!');
      setErrors({});

      // Preusmeri korisnika na stranicu sa planovima trčanja
      navigate('/run-plans');
      
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ login: 'Invalid credentials. Please try again.' });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <PoljeZaUnos
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email ? errors.email[0] : null}
          />
          <PoljeZaUnos
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password ? errors.password[0] : null}
          />
          {errors.login && <p className="error-text">{errors.login}</p>}
          <button type="submit">Login</button>
          {successMessage && <p className="success-text">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
