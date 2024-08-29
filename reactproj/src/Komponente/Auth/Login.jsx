import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import PoljeZaUnos from './PoljeZaUnos';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ setToken, setUser }) => {  // Dodajemo setUser prop
  const [formData, setFormData] = useState({
    email: 'marcel.pagac@example.net',
    password: 'password',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const user = response.data.user;

      // Sačuvaj token u session storage-u
      sessionStorage.setItem('auth_token', token);

      // Sačuvaj podatke o korisniku u session storage
      sessionStorage.setItem('user', JSON.stringify(user));

      // Postavi token i korisnika u App.js
      setToken(token);
      setUser(user);

      // Preusmeri korisnika na osnovu role_id
      if (user.role_id === 1) {
        navigate('/adminPanel');
      } else {
        navigate('/run-plans');
      }

      // Postavi poruku o uspehu i izbriši greške
      setSuccessMessage('Login successful!');
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ login: 'Invalid credentials. Please try again.' });
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
          <div className="password-input-container">
            <PoljeZaUnos
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password ? errors.password[0] : null}
            />
            <button type="button" onClick={toggleShowPassword} className="password-toggle-button">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.login && <p className="error-text">{errors.login}</p>}
          <button type="submit">Login</button>
          {successMessage && <p className="success-text">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
