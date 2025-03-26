import React, { useState } from 'react';
import axios from 'axios';
import './Registracija.css';
import PoljeZaUnos from './PoljeZaUnos';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Registracija = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    profile_photo: null,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('password_confirmation', formData.password_confirmation);
    if (formData.profile_photo) {
      form.append('profile_photo', formData.profile_photo);
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', form);
      setSuccessMessage('Registration successful!');
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="registracija-container">
      <div className="registracija-content">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <PoljeZaUnos
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name ? errors.name[0] : null}
          />
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
          <div className="password-input-container">
            <PoljeZaUnos
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              error={errors.password_confirmation ? errors.password_confirmation[0] : null}
            />
            <button type="button" onClick={toggleShowConfirmPassword} className="password-toggle-button">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="form-group">
            <label>Profile Photo</label>
            <input type="file" name="profile_photo" onChange={handleFileChange} />
            {errors.profile_photo && <p className="error-text">{errors.profile_photo[0]}</p>}
          </div>

          <button type="submit">Register</button>
          {successMessage && <p className="success-text">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Registracija;
