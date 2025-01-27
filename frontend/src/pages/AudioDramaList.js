import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AudioDramaList.css';

const AudioDramaList = () => {
  const [audioDramas, setAudioDramas] = useState([]);

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

  return (
    <div className="audio-drama-list container">
      <h1 className="title">Audiodramas Disponibles</h1>
      <div className="grid">
        {audioDramas.map((drama) => (
          <div key={drama._id} className="card">
            <h2>{drama.title}</h2>
            <p>{drama.description}</p>
            <p><strong>Temporada:</strong> {drama.season}</p>
            <Link to={`/audiodrama/${drama._id}`} className="btn btn-primary">
              Ver detalles
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioDramaList;