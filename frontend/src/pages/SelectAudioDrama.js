import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SelectAudioDrama = () => {
  const [audioDramas, setAudioDramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAudioDramas = async () => {
      try {
        const response = await fetch('/api/audio-dramas');
        const data = await response.json();
        setAudioDramas(data);
      } catch (error) {
        console.error('Error al cargar los audiodramas:', error);
      }
    };
    fetchAudioDramas();
  }, []);

  if (loading) return <p>Cargando audiodramas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Selecciona un AudioDrama</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {audioDramas.map((drama) => (
          <li
            key={drama._id}
            className="border p-4 rounded-md hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/manage-chapters/${drama._id}`)}
          >
            <h2 className="text-xl font-semibold">{drama.title}</h2>
            <p className="text-sm text-gray-600">{drama.description || "Sin descripción"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectAudioDrama;