import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/AudioDramaDetails.css';

const AudioDramaDetails = () => {
  const { id } = useParams(); // Obtener ID del audiodrama desde la URL
  const [audioDrama, setAudioDrama] = useState(null);

  useEffect(() => {
    const fetchAudioDrama = async () => {
      try {
        const response = await fetch(`/api/audio-dramas/${id}`);
        const data = await response.json();
        setAudioDrama(data);
      } catch (error) {
        console.error('Error al cargar los detalles del audiodrama:', error);
      }
    };

    fetchAudioDrama();
  }, [id]);

  if (!audioDrama) {
    return <p>Cargando detalles...</p>;
  }

  return (
    <div className="audio-drama-details container">
      <h1 className="title">{audioDrama.title}</h1>
      <p className="description">{audioDrama.description}</p>
      <p className="genres"><strong>Géneros:</strong> {audioDrama.genres.join(', ')}</p>
      <p className="progress"><strong>Progreso:</strong> {audioDrama.progress}</p>

      <h2>Temporadas</h2>
      {audioDrama.seasons.map((season) => (
        <div key={season.seasonNumber} className="season">
          <h3>Temporada {season.seasonNumber}</h3>
          <ul>
            {season.chapters.map((chapter) => (
              <li key={chapter.episode}>
                <strong>Ep. {chapter.episode}:</strong> {chapter.title} 
                <a href={chapter.videoLinks[0]?.url} target="_blank" rel="noopener noreferrer" className="video-link">
                  Ver episodio
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AudioDramaDetails;