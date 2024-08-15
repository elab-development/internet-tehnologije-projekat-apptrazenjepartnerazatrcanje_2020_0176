import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Pocetna from './Komponente/Pocetna';
import Registracija from './Komponente/Auth/Registracija';
import Login from './Komponente/Auth/Login';
import PrikazPlanova from './Komponente/PlanoviTrcanja/PrikazPlanova';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/register" element={<Registracija />} />
          <Route path="/login" element={<Login />} />
          <Route path="/run-plans" element={<PrikazPlanova />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
