import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SelectAudioDrama.css";

const SelectAudioDrama = () => {
  const [audioDramas, setAudioDramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAudioDramas = async () => {
      try {
        const response = await fetch("/api/audio-dramas");
        const data = await response.json();
        setAudioDramas(data);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar los audiodramas");
        setLoading(false);
      }
    };
    fetchAudioDramas();
  }, []);

  if (loading) return <p className="loading-text">Cargando audiodramas...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="container pt-5">
      <h1 className="title">Selecciona un AudioDrama</h1>
      <ul className="grid-layout">
        {audioDramas.map((drama) => (
          <li
            key={drama._id}
            className="audio-drama-card"
            onClick={() => navigate(`/manage-chapters/${drama._id}`)}
          >
            <h2 className="drama-title">{drama.title}</h2>
            <p className="drama-description">{drama.description || "Sin descripción"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectAudioDrama;