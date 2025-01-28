import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/AudioDramaDetails.css';

const AudioDramaDetails = () => {
  const { id } = useParams();
  const [audioDrama, setAudioDrama] = useState(null);
  const [error, setError] = useState(null);

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
        setError(error.message);
        console.error('Error al cargar los detalles del audiodrama:', error);
      }
    };

    fetchAudioDrama();
  }, [id]);

  if (error) {
    return <p className="error-message text-center">{error}</p>;
  }

  if (!audioDrama) {
    return <p className="text-center">Cargando detalles...</p>;
  }

  return (
    <div className="audio-drama-details container mt-5">
      <h1 className="title text-center">{audioDrama.title}</h1>
      <p className="description mx-auto">{audioDrama.description}</p>
      <div className="row mb-3">
        <div className="col">
          <p className="genres"><strong>Géneros:</strong> {audioDrama.genres.join(', ')}</p>
        </div>
        <div className="col">
        </div>
      </div>

      <h2 className="mt-5">Temporadas</h2>
      {audioDrama.seasons.length === 0 ? (
        <p>No hay temporadas disponibles para este audiodrama.</p>
      ) : (
        audioDrama.seasons.map((season) => (
          <div key={season.seasonNumber} className="season mb-4">
            <h3 className="season-title">{`Temporada ${season.seasonNumber}`}</h3>
            <ul className="list-unstyled">
              {season.chapters.length === 0 ? (
                <p>No hay capítulos disponibles para esta temporada.</p>
              ) : (
                season.chapters.map((chapter) => (
                  <li key={chapter.episode} className="d-flex justify-content-between align-items-center mb-3">
                    <span><strong>Ep. {chapter.episode}:</strong> {chapter.title}</span>
                    {chapter.videoLinks && chapter.videoLinks.length > 0 ? (
                      <Link
                        to={`/audio-dramas/${id}/seasons/${season.seasonNumber}/episodes/${chapter.episode}`}
                        className="btn btn-link video-link"
                      >
                        Ver episodio
                      </Link>
                    ) : (
                      <span>No hay enlaces de video disponibles.</span>
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