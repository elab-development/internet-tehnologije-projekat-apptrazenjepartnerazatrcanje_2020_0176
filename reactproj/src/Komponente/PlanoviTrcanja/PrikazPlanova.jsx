 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PrikazPlanova.css';

const PrikazPlanova = () => {
  const [runPlans, setRunPlans] = useState([]);

  useEffect(() => {
    const fetchRunPlans = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/run-plans');
        setRunPlans(response.data.data);  
      } catch (error) {
        console.error('Error fetching run plans:', error);
      }
    };

    fetchRunPlans();
  }, []);

  return (
    <div className="prikaz-planova-container">
      <h1>All Running Plans</h1>
      <div className="planovi-grid">
        {runPlans.length > 0 ? (
          runPlans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h2>{plan.location}</h2>
              <p>Date: {plan.time}</p>
              <p>Distance: {plan.distance} km</p>
              <p>Latitude: {plan.latitude}</p>
              <p>Longitude: {plan.longitude}</p>
            </div>
          ))
        ) : (
          <p>No running plans found.</p>
        )}
      </div>
    </div>
  );
};

export default PrikazPlanova;
