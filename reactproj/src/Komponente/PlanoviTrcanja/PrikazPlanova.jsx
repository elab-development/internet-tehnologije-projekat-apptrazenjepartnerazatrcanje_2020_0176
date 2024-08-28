import React, { useState } from 'react';
import PlanKartica from './PlanKartica'; 
import './PrikazPlanova.css';
import useFetchData from '../hooks/useFetchData';

const PrikazPlanova = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(''); 
  const [sortBy, setSortBy] = useState(''); 
  const itemsPerPage = 5;

  const { data: runPlans, loading, error, totalPages } = useFetchData(
    'http://127.0.0.1:8000/api/run-plans',
    currentPage,
    itemsPerPage
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

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

      <div className="sort-container">
        <button onClick={() => setSortBy('distance')}>
          Sort by Distance
        </button>
        <button onClick={() => setSortBy('date')}>
          Sort by Date
        </button>
      </div>

      <div className="planovi-grid">
        {runPlans.length > 0 ? (
          runPlans.map((plan) => (
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
