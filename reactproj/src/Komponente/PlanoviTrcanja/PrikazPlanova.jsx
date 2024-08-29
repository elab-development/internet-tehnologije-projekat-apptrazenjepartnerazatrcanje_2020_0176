import React, { useState, useEffect } from 'react';
import PlanKartica from './PlanKartica';
import './PrikazPlanova.css';
import axios from 'axios';

const PrikazPlanova = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');  // Dodajemo state za pretragu
  const [sortBy, setSortBy] = useState('');
  const [runPlans, setRunPlans] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRunPlans = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/run-plans/search', {
          params: {
            location: searchTerm,  // Koristimo searchTerm umesto filter
            per_page: itemsPerPage,
            page: currentPage,
          },
        });
        setRunPlans(response.data.data);
        setTotalPages(response.data.meta.last_page);
        setError(null);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchRunPlans();
  }, [searchTerm, currentPage]); // searchTerm pokreće ponovno učitavanje podataka

  const handleSearch = () => {
    setSearchTerm(filter); // Postavlja searchTerm prilikom klika na "Search"
    setCurrentPage(1); // Resetuje paginaciju na prvu stranicu prilikom nove pretrage
  };

  const handleResetSearch = () => {
    setFilter('');
    setSearchTerm(''); // Resetuje searchTerm da bi prikazali sve planove
    setCurrentPage(1); // Resetuje paginaciju na prvu stranicu
  };

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

  const sortPlans = (plans, criterion) => {
    return [...plans].sort((a, b) => {
      if (criterion === 'distance') {
        return a.distance - b.distance;
      } else if (criterion === 'date') {
        return new Date(a.time) - new Date(b.time);
      }
      return 0;
    });
  };

  const sortedRunPlans = sortPlans(runPlans, sortBy);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
        <button onClick={handleSearch}>Search</button> {/* Dodajemo dugme za pretragu */}
        <button onClick={handleResetSearch}>Reset Search</button> {/* Dodajemo dugme za resetovanje pretrage */}
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
        {sortedRunPlans.length > 0 ? (
          sortedRunPlans.map((plan) => (
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
