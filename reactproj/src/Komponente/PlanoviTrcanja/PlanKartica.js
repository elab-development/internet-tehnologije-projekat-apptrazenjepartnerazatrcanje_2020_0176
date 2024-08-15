 
import React from 'react';
import './PlanKartica.css';

const PlanKartica = ({ plan }) => {
  return (
    <div className="plan-card">
      <h2>{plan.location}</h2>
      <p>Date: {plan.time}</p>
      <p>Distance: {plan.distance} km</p>
      <p>Latitude: {plan.latitude}</p>
      <p>Longitude: {plan.longitude}</p>
    </div>
  );
};

export default PlanKartica;
