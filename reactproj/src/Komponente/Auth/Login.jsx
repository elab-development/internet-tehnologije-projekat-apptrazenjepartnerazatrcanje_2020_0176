import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

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
      setSuccessMessage('Login successful!');
      setErrors({});
      // You can save the token in local storage or state here
      console.log(response.data.access_token);
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
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            {errors.email && <p className="error-text">{errors.email[0]}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
            {errors.password && <p className="error-text">{errors.password[0]}</p>}
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
