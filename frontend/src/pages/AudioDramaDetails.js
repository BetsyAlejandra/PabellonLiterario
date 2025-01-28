import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/AudioDramaDetails.css';

const AudioDramaDetails = () => {
  const { id } = useParams(); // Obtener ID del audiodrama desde la URL
  const [audioDrama, setAudioDrama] = useState(null);
  const [error, setError] = useState(null); // Para manejar errores

  useEffect(() => {
    const fetchAudioDrama = async () => {
      try {
        const response = await fetch(`/api/audio-dramas/${id}`);
        if (!response.ok) {
          throw new Error('No se pudo obtener el audio drama');
        }
        const data = await response.json();
        setAudioDrama(data);
      } catch (error) {
        setError(error.message); // Establecer el mensaje de error
        console.error('Error al cargar los detalles del audiodrama:', error);
      }
    };

    fetchAudioDrama();
  }, [id]);

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

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
      {audioDrama.seasons.length === 0 ? (
        <p>No hay temporadas disponibles para este audiodrama.</p>
      ) : (
        audioDrama.seasons.map((season) => (
          <div key={season.seasonNumber} className="season">
            <h3>Temporada {season.seasonNumber}</h3>
            <ul>
              {season.chapters.length === 0 ? (
                <p>No hay capítulos disponibles para esta temporada.</p>
              ) : (
                season.chapters.map((chapter) => (
                  <li key={chapter.episode}>
                    <strong>Ep. {chapter.episode}:</strong> {chapter.title}
                    {chapter.videoLinks && chapter.videoLinks.length > 0 ? (
                      <Link
                        to={`/audio-dramas/${id}/seasons/${season.seasonNumber}/episodes/${chapter.episode}`}
                        className="video-link"
                      >
                        Ver episodio
                      </Link>
                    ) : (
                      <p>No hay enlaces de video disponibles.</p>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default AudioDramaDetails;