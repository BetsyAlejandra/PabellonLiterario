import React, { useState, useEffect } from 'react';

const NovelsPage = () => {
  const [novels, setNovels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [novelsPerPage] = useState(6); // Número de novelas por página
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

  if (loading) return <div className="text-center">Cargando novelas...</div>;
  if (error) return <div className="text-center">{error}</div>;

  return (
    <div className="container">
      <h2 className="text-center">Todas las Novelas</h2>
      <div className="row">
        {currentNovels.map((novel) => (
          <div className="col-md-4 mb-4" key={novel.id}>
            <div className="card">
              <div className="story-image-container">
                <img src={novel.cover} alt={novel.title} className="story-image" />
              </div>
              <div className="card-body">
                <h5 className="card-title">{novel.title}</h5>
                <p className="card-text">{novel.description.substring(0, 100)}...</p>
              </div>
              <div className="card-footer text-center">
                <button className="btn btn-outline-light">Leer más</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        novelsPerPage={novelsPerPage}
        totalNovels={novels.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ novelsPerPage, totalNovels, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalNovels / novelsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? 'active' : ''}`}
          >
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NovelsPage;