import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/search.css";
import Pagination from "react-bootstrap/Pagination";

const SearchResults = () => {
  const location = useLocation();
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/novels/search?query=${query}&page=${currentPage}`);
        setNovels(response.data.novels);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error al obtener resultados", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="search-results">
      <h2>Resultados para: "{query}"</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : novels.length > 0 ? (
        <div>
          <ul>
            {novels.map((novel) => (
              <li key={novel._id} className="novel-card">
                <h3>{novel.title}</h3>
                <p>{novel.author}</p>
              </li>
            ))}
          </ul>
          <Pagination className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      ) : (
        <p>No se encontraron resultados</p>
      )}
    </div>
  );
};

export default SearchResults;