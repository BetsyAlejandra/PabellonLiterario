// src/components/NovelsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/NovelsPage.css'; // Asegúrate de que este archivo CSS contenga los estilos necesarios

const NovelsPage = () => {
  const [novels, setNovels] = useState([]); // Todas las novelas
  const [displayedNovels, setDisplayedNovels] = useState([]); // Novelas que se muestran
  const [currentPage, setCurrentPage] = useState(1);
  const novelsPerPage = 8; // Número de novelas a cargar por bloque
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const observerRef = useRef(null); // Referencia para detectar el scroll

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch('/api/novels');
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Respuesta no es JSON');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setNovels(data);
          setDisplayedNovels(data.slice(0, novelsPerPage)); // Muestra solo las primeras novelas
        } else {
          throw new Error('Respuesta inesperada: no es un arreglo');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error en fetchNovels:', error.message);
        setError(error.message);
        setNovels([]);
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  useEffect(() => {
    if (!novels.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreNovels();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [novels, displayedNovels]);

  const loadMoreNovels = () => {
    const nextPage = currentPage + 1;
    const nextNovels = novels.slice(0, nextPage * novelsPerPage);

    if (nextNovels.length !== displayedNovels.length) {
      setDisplayedNovels(nextNovels);
      setCurrentPage(nextPage);
    }
  };

  if (loading) return <div className="novels-loading">Cargando novelas...</div>;
  if (error) return <div className="novels-error">{error}</div>;

  return (
    <div className="novels-container">
      <h2 className="novels-title">Todas las Novelas</h2>
      <div className="novels-grid">
        {displayedNovels.map((novel) => (
          <div className="novels-card" key={novel._id}>
            <img
              src={novel.coverImage}
              className="novels-cover"
              alt={`Cover image for ${novel.title}`}
            />
            <div className="novels-card-body">
              <h5 className="novels-card-title">{novel.title}</h5>
              <p className="novels-card-text">
                {novel.description.length > 100
                  ? `${novel.description.substring(0, 100)}...`
                  : novel.description}
              </p>
            </div>
            <div className="novels-card-footer">
              <Button as={Link} to={`/story-detail/${novel._id}`} className="novels-button">
                Ver más
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Elemento invisible que activa la carga cuando el usuario se acerca */}
      <div ref={observerRef} style={{ height: '50px' }}></div>
    </div>
  );
};

export default NovelsPage;