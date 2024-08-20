import React, { useState } from 'react';
import PlanKartica from './PlanKartica'; 
import './PrikazPlanova.css';
import useFetchData from '../hooks/useFetchData';

const PrikazPlanova = () => {
  const [runPlans] = useFetchData('http://127.0.0.1:8000/api/run-plans');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(''); // Filter za lokaciju
  const [sortBy, setSortBy] = useState(''); // Sortiranje po distanci ili datumu
  const itemsPerPage = 5;

  // Filtriranje planova na osnovu filtera
  const filteredPlans = runPlans.filter(plan => 
    plan.location.toLowerCase().includes(filter.toLowerCase())
  );

  // Funkcija za sortiranje
  const sortPlans = (plans) => {
    const sortedPlans = [...plans]; // Kreiramo kopiju niza da izbegnemo mutiranje izvornog niza
    if (sortBy === 'distance') {
      return sortedPlans.sort((a, b) => a.distance - b.distance);
    }
    if (sortBy === 'date') {
      return sortedPlans.sort((a, b) => new Date(a.time) - new Date(b.time));
    }
    return sortedPlans;
  };

  // Sortiraj filtrirane planove
  const sortedPlans = sortPlans(filteredPlans);

  // Ukupno stranica
  const totalPages = Math.ceil(sortedPlans.length / itemsPerPage);

  // Odredi podatke za prikaz na trenutnoj stranici
  const currentPlans = sortedPlans.slice(
    (currentPage - 1) * itemsPerPage,//0
    currentPage * itemsPerPage//1*5
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

      <div className="sort-container">
        <button onClick={() => setSortBy('distance')}>
          Sort by Distance
        </button>
        <button onClick={() => setSortBy('date')}>
          Sort by Date
        </button>
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
