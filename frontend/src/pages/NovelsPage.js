import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/NovelsPage.css';

const NovelsPage = () => {
  const [novels, setNovels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [novelsPerPage] = useState(6);
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
          <div className="novels-card" key={novel.id}>
            <img
              src={novel.coverImage}
              className="novels-cover"
              alt={`Cover image for ${novel.title}`}
            />
            <div className="novels-card-body">
              <h5 className="novels-card-title">{novel.title}</h5>
              <p className="novels-card-text">{novel.description.substring(0, 100)}...</p>
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
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalNovels / novelsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="novels-pagination">
      <button onClick={prevPage} className="novels-pagination-arrow">
        &#8592;
      </button>
      <ul className="novels-pagination-list">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`novels-pagination-item ${currentPage === number ? 'active' : ''}`}
          >
            <button onClick={() => paginate(number)} className="novels-pagination-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={nextPage} className="novels-pagination-arrow">
        &#8594;
      </button>
    </nav>
  );
};

export default NovelsPage;