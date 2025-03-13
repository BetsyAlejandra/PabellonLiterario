import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/error.css";

const Error500 = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>500</h1>
        <p>Los archivos secretos se han perdido en la biblioteca... Intenta de nuevo más tarde.</p>
        <Link to="/" className="btn-return">Volver al inicio</Link>
      </div>
    </div>
  );
};

export default Error500;