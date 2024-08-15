 
import React from 'react';
import './PoljeZaUnos.css';

const PoljeZaUnos = ({ label, type, name, value, onChange, error }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default PoljeZaUnos;
