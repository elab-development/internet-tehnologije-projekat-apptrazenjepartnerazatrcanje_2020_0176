import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Pocetna from './Komponente/Pocetna';
import Registracija from './Komponente/Auth/Registracija';
import Login from './Komponente/Auth/Login';
import PrikazPlanova from './Komponente/PlanoviTrcanja/PrikazPlanova'; 
import 'leaflet/dist/leaflet.css';
import Navbar from './Komponente/Navigacija/Navbar';
import MojProfil from './Komponente/Auth/MojProfil';
import RunPlanDetails from './Komponente/PlanoviTrcanja/RunPlanDetails';
import UserStats from './Komponente/Stats/UserStats';
import ExerciseList from './Komponente/SpoljniApi/ExerciseList';
import AdminPanel from './Komponente/Admin/AdminPanel'; 
import AdminUsers from './Komponente/Admin/AdminUsers';

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
        <Navbar token={token} setToken={setToken} />
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/register" element={<Registracija />} />
          <Route 
            path="/login" 
            element={<Login setToken={setToken} />} 
          />       
          <Route path="/runplan/:id" element={<RunPlanDetails />} />

          <Route path="/run-plans" element={<PrikazPlanova />} />


          <Route path="/userStats" element={<UserStats />} />
          <Route path="/exercises" element={<ExerciseList />} />

          
          <Route path="/adminPanel" element={<AdminPanel />} /> 
          <Route path="/adminUsers" element={<AdminUsers />} />

          <Route path="/profile" element={<MojProfil />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
