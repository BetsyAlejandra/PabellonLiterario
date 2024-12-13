// src/components/NovelsPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/NovelsPage.css'; // Asegúrate de que este archivo CSS contenga los estilos necesarios

const NovelsPage = () => {
  const [novels, setNovels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [novelsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const indexOfLastNovel = currentPage * novelsPerPage;
  const indexOfFirstNovel = indexOfLastNovel - novelsPerPage;
  const currentNovels = novels.slice(indexOfFirstNovel, indexOfLastNovel);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(novels.length / novelsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <div className="novels-loading">Cargando novelas...</div>;
  if (error) return <div className="novels-error">{error}</div>;

  return (
    <div className="novels-container">
      <h2 className="novels-title">Todas las Novelas</h2>
      <div className="novels-grid">
        {currentNovels.map((novel) => (
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
      <Pagination
        novelsPerPage={novelsPerPage}
        totalNovels={novels.length}
        paginate={paginate}
        currentPage={currentPage}
        nextPage={nextPage}
        prevPage={prevPage}
      />
    </div>
  );
};

const Pagination = ({ novelsPerPage, totalNovels, paginate, currentPage, nextPage, prevPage }) => {
  const totalPages = Math.ceil(totalNovels / novelsPerPage);
  const pageNumbers = generatePageNumbers(totalPages, currentPage);

  return (
    <nav className="novels-pagination">
      <button
        onClick={prevPage}
        className="novels-pagination-arrow"
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        &#8592;
      </button>
      <ul className="novels-pagination-list">
        {pageNumbers.map((number, index) =>
          number === 'left-ellipsis' || number === 'right-ellipsis' ? (
            <li key={index} className="novels-pagination-ellipsis">
              &hellip;
            </li>
          ) : (
            <li
              key={number}
              className={`novels-pagination-item ${currentPage === number ? 'active' : ''}`}
            >
              <button
                onClick={() => paginate(number)}
                className="novels-pagination-link"
                aria-current={currentPage === number ? 'page' : undefined}
              >
                {number}
              </button>
            </li>
          )
        )}
      </ul>
      <button
        onClick={nextPage}
        className="novels-pagination-arrow"
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        &#8594;
      </button>
    </nav>
  );
};

/**
 * Genera un arreglo de números de página y puntos suspensivos según la página actual y el total de páginas.
 * @param {number} totalPages - Total de páginas.
 * @param {number} currentPage - Página actual.
 * @returns {Array} - Arreglo de números de página y puntos suspensivos.
 */
const generatePageNumbers = (totalPages, currentPage) => {
  const pageNumbers = [];
  const siblingCount = 1; // Número de páginas a mostrar a cada lado de la página actual
  const totalPageNumbers = siblingCount * 2 + 5; // Primero, último, actual, y los hermanos

  if (totalPages <= totalPageNumbers) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount;
      for (let i = 1; i <= leftItemCount; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('right-ellipsis');
      pageNumbers.push(totalPages);
    } else if (showLeftEllipsis && !showRightEllipsis) {
      pageNumbers.push(1);
      pageNumbers.push('left-ellipsis');
      const rightItemCount = 3 + 2 * siblingCount;
      for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (showLeftEllipsis && showRightEllipsis) {
      pageNumbers.push(1);
      pageNumbers.push('left-ellipsis');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('right-ellipsis');
      pageNumbers.push(totalPages);
    }
  }

  return pageNumbers;
};

export default NovelsPage;