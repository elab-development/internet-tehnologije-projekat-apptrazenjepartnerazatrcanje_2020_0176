import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const mapContainerStyle = {
    width: '100%',
    height: '200px',
};

const PlanKartica = ({ plan }) => {
  const [isJoined, setIsJoined] = useState(false); // Pratimo da li je korisnik već pridružen planu
  const [error, setError] = useState(null);

  // Proveravamo da li je plan već pridružen pri učitavanju komponente
  useEffect(() => {
    const joinedPlans = JSON.parse(localStorage.getItem('joinedPlans')) || [];
    if (joinedPlans.includes(plan.id)) {
      setIsJoined(true);
    }
  }, [plan.id]);

  const handleJoinPlan = async () => {
    try {
      const token = sessionStorage.getItem('auth_token');
      await axios.post(
        'http://127.0.0.1:8000/api/run-participants',
        { run_plan_id: plan.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Ažuriramo stanje da je plan pridružen
      setIsJoined(true);

      // Dodajemo plan u LocalStorage
      const joinedPlans = JSON.parse(localStorage.getItem('joinedPlans')) || [];
      joinedPlans.push(plan.id);
      localStorage.setItem('joinedPlans', JSON.stringify(joinedPlans));

    } catch (err) {
      setError('Failed to join the plan. Please try again.');
      console.error(err);
    }
  };

  const latitude = parseFloat(plan.latitude);
  const longitude = parseFloat(plan.longitude);

  return (
    <div className="plan-card">
      <h2>{plan.location}</h2>
      <p>Date: {plan.time}</p>
      <p>Distance: {plan.distance} km</p>
      <div className="map-container">
        <MapContainer style={mapContainerStyle} center={[latitude, longitude]} zoom={12}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[latitude, longitude]}>
            <Popup>
              {plan.location} <br /> {plan.distance} km
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <button 
        onClick={handleJoinPlan} 
        disabled={isJoined} 
        className="join-plan-button"
      >
        {isJoined ? 'Joined' : 'Join Plan'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PlanKartica;
