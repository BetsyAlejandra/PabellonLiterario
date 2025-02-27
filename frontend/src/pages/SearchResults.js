import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/search.css";
import Pagination from "react-bootstrap/Pagination";
import { FaBookOpen } from "react-icons/fa";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const query = location.state?.query || new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
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

    fetchResults();
  }, [query, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const goToNovel = (id) => {
    navigate(`/story-detail/${id}`);
  };

  return (
    <div className="search-results">
      <h2>Resultados para: "{query}"</h2>
      {loading ? (
        <div className="loading">Cargando...</div>
      ) : novels.length > 0 ? (
        <div>
          <div className="search-grid">
            {novels.map((novel) => (
              <div
                key={novel._id}
                className="novel-card"
                onClick={() => goToNovel(novel._id)}
                title={`Ver "${novel.title}"`}
              >
                <div className="novel-cover">
                  <img src={novel.cover || "/default-cover.jpg"} alt={novel.title} />
                </div>
                <div className="novel-info">
                  <h3>{novel.title}</h3>
                  <p>{novel.author}</p>
                  <button className="read-btn">
                    <FaBookOpen /> Leer más
                  </button>
                </div>
              </div>
            ))}
          </div>
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