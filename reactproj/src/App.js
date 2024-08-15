import logo from './logo.svg';
import './App.css';
import Pocetna from './Komponente/Pocetna';
import Registracija from './Komponente/Auth/Registracija';

function App() {
  return (
    <div className="App">
      <Pocetna></Pocetna>
      <Registracija></Registracija>
    </div>
  );
}

export default App;
