import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/error.css";

const Error404 = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>404</h1>
        <p>Parece que has entrado en un sendero oculto... Esta página no existe.</p>
        <Link to="/" className="btn-return">Volver al inicio</Link>
      </div>
    </div>
  );
};

export default Error404;