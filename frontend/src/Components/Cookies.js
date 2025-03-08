import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AvisoCookies = () => {
  const [mostrarAviso, setMostrarAviso] = useState(false);

  useEffect(() => {
    const cookiesAceptadas = localStorage.getItem('cookiesAceptadas');
    if (!cookiesAceptadas) {
      setMostrarAviso(true);
    }
  }, []);

  const aceptarCookies = () => {
    localStorage.setItem('cookiesAceptadas', 'true');
    setMostrarAviso(false);
  };

  const rechazarCookies = () => {
    setMostrarAviso(false);
  };

  return (
    <>
      {mostrarAviso && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#D6B4A1',
            color: '#5A4A42',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            borderRadius: '15px',
            textAlign: 'center',
            zIndex: 1000,
            maxWidth: '600px',
          }}
        >
          <p>
            Utilizamos cookies para mejorar tu experiencia y analizar el tráfico de la página.
            Consulta nuestra <a href="/politica" style={{ color: '#5A4A42', textDecoration: 'underline' }}>Política de Privacidad</a>.
          </p>
          <div style={{ marginTop: '10px' }}>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={aceptarCookies}
              style={{
                marginRight: '10px',
                padding: '10px 20px',
                background: '#5A4A42',
                color: '#E8E2D6',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '10px',
                transition: 'background 0.3s'
              }}
            >
              Aceptar
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={rechazarCookies}
              style={{
                padding: '10px 20px',
                background: '#B5A89A',
                color: '#5A4A42',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '10px',
                transition: 'background 0.3s'
              }}
            >
              Rechazar
            </motion.button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AvisoCookies;