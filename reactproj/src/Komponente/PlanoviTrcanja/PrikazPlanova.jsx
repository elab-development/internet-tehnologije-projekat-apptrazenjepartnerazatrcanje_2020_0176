import React from 'react';
 
import PlanKartica from './PlanKartica'; 
import './PrikazPlanova.css';
import useFetchData from '../hooks/useFetchData';

const PrikazPlanova = () => {
  const [runPlans] = useFetchData('http://127.0.0.1:8000/api/run-plans');

  return (
    <div className="prikaz-planova-container">
      <h1>All Running Plans</h1>
      <div className="planovi-grid">
        {runPlans.length > 0 ? (
          runPlans.map((plan) => (
            <PlanKartica key={plan.id} plan={plan} />  
          ))
        ) : (
          <p>No running plans found.</p>
        )}
      </div>
    </div>
  );
};

export default PrikazPlanova;
