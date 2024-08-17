import React, { useState } from 'react';
import PlanKartica from './PlanKartica'; 
import './PrikazPlanova.css';
import useFetchData from '../hooks/useFetchData';

const PrikazPlanova = () => {
  const [runPlans] = useFetchData('http://127.0.0.1:8000/api/run-plans');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(''); // Filter za lokaciju
  const itemsPerPage = 5;

  // Filtriranje planova na osnovu filtera
  const filteredPlans = runPlans.filter(plan => 
    plan.location.toLowerCase().includes(filter.toLowerCase())
  );

  // Ukupno stranica
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);

  // Odredi podatke za prikaz na trenutnoj stranici
  const currentPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="prikaz-planova-container">
      <h1>All Running Plans</h1>

      <div className="filter-container">
        <input 
          type="text" 
          placeholder="Filter by location..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)} 
        />
      </div>

      <div className="planovi-grid">
        {currentPlans.length > 0 ? (
          currentPlans.map((plan) => (
            <PlanKartica key={plan.id} plan={plan} />  
          ))
        ) : (
          <p>No running plans found.</p>
        )}
      </div>
      
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PrikazPlanova;
