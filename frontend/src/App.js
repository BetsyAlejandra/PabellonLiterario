import React from 'react';
import axios from 'axios';  
import 'bootstrap/dist/css/bootstrap.min.css'; // Estilos de Bootstrap
import Header from './Components/Header.js';
import Footer from './Components/Footer.js';
import Home from './pages/Home.js';
import NovelForm from './pages/NovelForm.js';

// Configuración global de Axios
axios.defaults.baseURL = 'http://localhost:5000'; // Cambia al puerto de tu backend

function App() {
  return (
    <div className="App">
      <Header />
      <Home />  {/* Aquí se muestra el componente Home */}
      <Footer />
    </div>
  );
}

export default App;
