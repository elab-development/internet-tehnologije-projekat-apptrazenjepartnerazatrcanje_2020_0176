import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const UserStats = () => {
  const [userStats, setUserStats] = useState([]);
  const [totalDistance, setTotalDistance] = useState('');
  const [totalRuns, setTotalRuns] = useState('');
  const [aggregatedStats, setAggregatedStats] = useState(null);
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

    // Učitavanje agregiranih statistika za sve korisnike
    const fetchAggregatedStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user-stats/aggregated', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAggregatedStats(response.data);
      } catch (err) {
        setError('Failed to load aggregated stats.');
        console.error(err);
      }
    };

    fetchUserStats();
    fetchAggregatedStats();
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
  const averageDistancePerRun = totalRuns2 ? (totalKilometers / totalRuns2).toFixed(2) : 0;

  const barData = {
    labels: ['Your Stats', 'Average Stats', 'Max Stats'],
    datasets: [
      {
        label: 'Total Distance (km)',
        data: [
          totalKilometers,
          aggregatedStats?.average_distance || 0,
          aggregatedStats?.max_distance || 0,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Total Runs',
        data: [
          totalRuns2,
          aggregatedStats?.average_runs || 0,
          aggregatedStats?.max_runs || 0,
        ],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div className="user-stats">
      <h2>Your Running Statistics</h2>
      {error && <p className="error">{error}</p>}
      
      <div className="totals">
        <p>Total Kilometers: {totalKilometers} km</p>
        <p>Total Runs: {totalRuns2}</p>
        <p>Average Distance per Run: {averageDistancePerRun} km</p>
      </div>

      {aggregatedStats && (
        <div style={{ width: '60%', margin: '0 auto' }}>
          <Bar data={barData} />
        </div>
      )}

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
