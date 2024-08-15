import React from 'react';
import './Pocetna.css';
import { FaRunning, FaMapMarkerAlt, FaUsers, FaRegClock } from 'react-icons/fa';

const Pocetna = () => {
  return (
    <div className="pocetna-container">
      <div className="pocetna-content">
        <div className="pocetna-text">
          <h1>Find Your Running Partner</h1>
          <p>Join our community and connect with runners near you!</p>
        </div>
        <div className="pocetna-grid">
          <div className="pocetna-card">
            <FaRunning className="pocetna-icon" />
            <h2>FIND RUNNERS</h2>
          </div>
          <div className="pocetna-card">
            <FaMapMarkerAlt className="pocetna-icon" />
            <h2>EXPLORE ROUTES</h2>
          </div>
          <div className="pocetna-card">
            <FaUsers className="pocetna-icon" />
            <h2>JOIN GROUPS</h2>
          </div>
          <div className="pocetna-card">
            <FaRegClock className="pocetna-icon" />
            <h2>TRACK TIME</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pocetna;
