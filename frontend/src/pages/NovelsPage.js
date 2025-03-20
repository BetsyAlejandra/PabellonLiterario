import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { Button, Pagination } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/NovelsPage.css';

// Lazy load de la imagen
const LazyImage = lazy(() => import('../Components/LazyImage.js'));

const NovelsPage = () => {
  const [novels, setNovels] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [novelsPerPage, setNovelsPerPage] = useState(8); // Valor por defecto

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Función para actualizar el número de novelas por página según el tamaño de la pantalla
  const updateNovelsPerPage = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1600) {
      setNovelsPerPage(12); // Más novelas en pantallas grandes
    } else if (width >= 1200) {
      setNovelsPerPage(10);
    } else if (width >= 992) {
      setNovelsPerPage(8);
    } else if (width >= 768) {
      setNovelsPerPage(6);
    } else {
      setNovelsPerPage(4); // Menos novelas en móviles
    }
  }, []);

  useEffect(() => {
    updateNovelsPerPage(); // Se ejecuta al montar el componente
    window.addEventListener('resize', updateNovelsPerPage);
    return () => window.removeEventListener('resize', updateNovelsPerPage);
  }, [updateNovelsPerPage]);

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
  }, [currentPage, novelsPerPage]);

  useEffect(() => {
    setSearchParams({ page: currentPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, setSearchParams]);

  const memoizedNovels = useMemo(() => novels, [novels]);
  const handlePageChange = useCallback((page) => setCurrentPage(page), []);

  if (loading) return <div className="novels-loading">Cargando novelas...</div>;
  if (error) return <div className="novels-error">{error}</div>;

  return (
    <div className="novels-container">
      <h2 className="novels-title">Todas las Novelas</h2>
      <div className="novels-grid">
        {memoizedNovels.map((novel, index) => (
          <div className="novels-card" key={novel._id}>
            <Suspense fallback={<div className="novels-placeholder">Cargando imagen...</div>}>
              <LazyImage
                src={novel.coverImage}
                alt={`Portada de ${novel.title}`}
                priority={index === 0}
              />
            </Suspense>
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
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

        {currentPage > 2 && (
          <>
            <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
            {currentPage > 3 && <Pagination.Ellipsis />}
          </>
        )}

        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter((page) => page >= currentPage - 1 && page <= currentPage + 1)
          .map((page) => (
            <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
              {page}
            </Pagination.Item>
          ))}

        {currentPage < totalPages - 1 && (
          <>
            {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
            <Pagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>
          </>
        )}

        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
};

export default NovelsPage;