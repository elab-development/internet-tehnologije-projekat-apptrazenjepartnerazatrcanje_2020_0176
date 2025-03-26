import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminPanel = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      const token = sessionStorage.getItem('auth_token'); // Get the token from session storage
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admin/statistics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStatistics(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <p>Loading statistics...</p>;
  if (error) return <p>Error loading statistics: {error.message}</p>;

  const barData = {
    labels: ['Total Users', 'Total Run Plans', 'Total Comments', 'Total Participants'],
    datasets: [
      {
        label: 'Counts',
        data: [
          statistics.total_users,
          statistics.total_run_plans,
          statistics.total_comments,
          statistics.total_run_participants,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#2c3e50' }}>Admin Panel</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <div style={{
          backgroundColor: '#3498db', 
          padding: '20px', 
          borderRadius: '8px', 
          color: '#fff', 
          textAlign: 'center'
        }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{statistics.total_users}</p>
        </div>
        
        <div style={{
          backgroundColor: '#1abc9c', 
          padding: '20px', 
          borderRadius: '8px', 
          color: '#fff', 
          textAlign: 'center'
        }}>
          <h3>Total Run Plans</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{statistics.total_run_plans}</p>
        </div>
        
        <div style={{
          backgroundColor: '#9b59b6', 
          padding: '20px', 
          borderRadius: '8px', 
          color: '#fff', 
          textAlign: 'center'
        }}>
          <h3>Total Comments</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{statistics.total_comments}</p>
        </div>

        <div style={{
          backgroundColor: '#e67e22', 
          padding: '20px', 
          borderRadius: '8px', 
          color: '#fff', 
          textAlign: 'center'
        }}>
          <h3>Total Run Participants</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{statistics.total_run_participants}</p>
        </div>
        
        <div style={{
          backgroundColor: '#e74c3c', 
          padding: '20px', 
          borderRadius: '8px', 
          color: '#fff', 
          textAlign: 'center'
        }}>
          <h3>Most Used Location</h3>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{statistics.most_used_location || 'N/A'}</p>
        </div>
        
        <div style={{
          backgroundColor: '#2ecc71', 
          padding: '20px', 
          borderRadius: '8px', 
          color: '#fff', 
          textAlign: 'center'
        }}>
          <h3>Most Active User</h3>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{statistics.most_active_user || 'N/A'}</p>
        </div>
        
        <div style={{
          backgroundColor: '#f39c12', 
          padding: '20px', 
          borderRadius: '8px', 
          color: '#fff', 
          textAlign: 'center'
        }}>
          <h3>New Users (Last 30 Days)</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{statistics.new_users_last_30_days}</p>
        </div>
      </div>

      <div style={{ width: '80%', margin: '0 auto' }}>
        <Bar data={barData} options={{
          plugins: {
            legend: {
              display: true,
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: true,
            }
          }
        }} />
      </div>
    </div>
  );
};

export default AdminPanel;
