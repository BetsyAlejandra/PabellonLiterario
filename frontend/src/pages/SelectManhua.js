import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SelectManhua.css";

const SelectManhua = () => {
  const [manhuas, setManhuas] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManhuas = async () => {
      try {
        const response = await axios.get(`/api/manhuas?query=${query}`);
        setManhuas(response.data.manhuas);
      } catch (error) {
        console.error("Error al obtener manhuas", error);
      }
    };

    fetchManhuas();
  }, [query]);

  return (
    <div className="select-manhua-container">
      <h2 className="select-title">Selecciona un Manhua</h2>
      
      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar manhua..."
        className="search-bar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Grid de manhuas */}
      <div className="manhua-grid">
        {manhuas.map((manhua) => (
          <div
            key={manhua._id}
            className="manhua-card"
            onClick={() => navigate(`/manhua/${manhua._id}/upload-chapter`)}
          >
            <img
              src={manhua.coverImage || "/default-cover.jpg"}
              alt={manhua.title}
              className="manhua-cover"
              loading="lazy"
            />
            <div className="manhua-info">
              <p className="manhua-title">{manhua.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectManhua;