import logo from './logo.svg';
import './App.css';
import Pocetna from './Komponente/Pocetna';
import Registracija from './Komponente/Auth/Registracija';
import Login from './Komponente/Auth/Login';

function App() {
  return (
    <div className="App">
      <Pocetna></Pocetna>
      <Registracija></Registracija>
      <Login></Login>
    </div>
  );
}

export default App;
