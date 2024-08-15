import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


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
    </div>
  );
};

export default PlanKartica;
