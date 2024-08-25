import React, { useState, useEffect } from 'react';
import axios from 'axios';


const UserStats = () => {
  const [userStats, setUserStats] = useState([]);
  const [totalDistance, setTotalDistance] = useState('');
  const [totalRuns, setTotalRuns] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token'); 

    // Učitavanje postojećih statistika korisnika
    const fetchUserStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user-stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserStats(response.data.data);
      } catch (err) {
        setError('Failed to load user stats.');
        console.error(err);
      }
    };

    fetchUserStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('auth_token');
    const userId = sessionStorage.getItem('user_id'); 

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user-stats', {
        user_id: userId,
        total_distance: totalDistance,
        total_runs: totalRuns,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserStats([...userStats, response.data.data]);
      setTotalDistance(''); 
      setTotalRuns(''); 
    } catch (err) {
      setError('Failed to submit user stats.');
      console.error(err);
    }
  };

  const totalKilometers = userStats.reduce((acc, stat) => acc + stat.total_distance, 0);
  const totalRuns2 = userStats.reduce((acc, stat) => acc + stat.total_runs, 0);
  const averageDistancePerRun = totalRuns ? (totalKilometers / totalRuns).toFixed(2) : 0;
  
  return (
    <div className="user-stats">
      <h2>Your Running Statistics</h2>
      {error && <p className="error">{error}</p>}
      
      <div className="totals">
        <p>Total Kilometers: {totalKilometers} km</p>
        <p>Total Runs: {totalRuns2}</p>
        <p>Average Distance per Run: {averageDistancePerRun} km</p>
      </div>
  
      <ul>
        {userStats.map(stat => (
          <li key={stat.id}>
            <p>Total Distance: {stat.total_distance} km</p>
            <p>Total Runs: {stat.total_runs}</p>
          </li>
        ))}
      </ul>
  
      <h3>Add New Statistics</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Total Distance (km):</label>
          <input 
            type="number" 
            value={totalDistance} 
            onChange={(e) => setTotalDistance(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Total Runs:</label>
          <input 
            type="number" 
            value={totalRuns} 
            onChange={(e) => setTotalRuns(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Submit Stats</button>
      </form>
    </div>
  );
};

export default UserStats;
