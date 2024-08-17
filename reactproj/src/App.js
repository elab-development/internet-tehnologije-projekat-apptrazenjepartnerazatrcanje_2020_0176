import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Pocetna from './Komponente/Pocetna';
import Registracija from './Komponente/Auth/Registracija';
import Login from './Komponente/Auth/Login';
import PrikazPlanova from './Komponente/PlanoviTrcanja/PrikazPlanova';
import 'leaflet/dist/leaflet.css';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Proveri da li postoji token u sessionStorage kada se aplikacija učita
    const storedToken = sessionStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/register" element={<Registracija />} />
          <Route 
            path="/login" 
            element={<Login setToken={setToken} />} 
          />
          <Route path="/run-plans" element={<PrikazPlanova />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
