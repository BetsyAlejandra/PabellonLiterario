import React, { useState, useEffect } from 'react';
import { Button, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/NovelsPage.css';

const NovelsPage = () => {
  const [novels, setNovels] = useState([]); // Novelas actuales en la página
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const novelsPerPage = 8; // Número de novelas por página

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/novels?page=${currentPage}&limit=${novelsPerPage}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Error al obtener las novelas');

        setNovels(data.novels);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error en fetchNovels:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, [currentPage]);

  if (loading) return <div className="novels-loading">Cargando novelas...</div>;
  if (error) return <div className="novels-error">{error}</div>;

  return (
    <div className="novels-container">
      <h2 className="novels-title">Todas las Novelas</h2>
      <div className="novels-grid">
        {novels.map((novel) => (
          <div className="novels-card" key={novel._id}>
            <img
              src={novel.coverImage}
              className="novels-cover"
              alt={`Portada de ${novel.title}`}
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

      {/* Paginación */}
      <Pagination className="novels-pagination">
        <Pagination.Prev
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default NovelsPage;