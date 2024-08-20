import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Obriši token iz sessionStorage
      sessionStorage.removeItem('auth_token');
      setToken(null);

      // Preusmeri korisnika na početnu stranicu
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('An error occurred during logout');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">My Running App</Link>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        {token ? (
          <>
            <Link to="/profile" className="navbar-link">My profile</Link>
            <Link to="/run-plans" className="navbar-link">Running Plans</Link>
            <button onClick={handleLogout} className="navbar-link logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
