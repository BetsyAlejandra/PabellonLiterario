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

  // Función para cortar la descripción
  const truncateDescription = (description, length = 150) => {
    if (description.length > length) {
      return description.substring(0, length) + '...';
    }
    return description;
  };

  return (
    <div className="audio-drama-list container py-5">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3101266953328074"
        crossorigin="anonymous"></script>
      <h1 className="title text-center mb-4">Audiodramas Disponibles</h1>

      <div className="row">
        {/* Lista de audiodramas */}
        <div className="col-lg-8">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {audioDramas.map((drama) => (
              <div key={drama._id} className="col">
                <div className="card shadow-sm border-light rounded-3 h-100">
                  <div className="card-body">
                    <h5 className="card-title text-dark">{drama.title}</h5>
                    <p className="card-text text-muted">
                      {truncateDescription(drama.description, 150)} {/* 150 caracteres */}
                    </p>
                    <Link to={`/audiodrama/${drama._id}`} className="btn btn-primary w-100">
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna lateral con información sobre Patreon y suscripción */}
        <div className="col-lg-4">
          <div className="info-box shadow-sm rounded-3 p-3">
            <h5 className="info-title">¿Cómo funciona el acceso a los episodios?</h5>
            <p className="info-text">
              Los episodios 0 y 1 siempre están disponibles de forma gratuita para todos. Los episodios posteriores estarán
              disponibles para los patrocinadores de Patreon primero, y se liberarán de manera gratuita 8 días después.
            </p>
            <p className="info-text">
              Los suscriptores de Patreon también pueden votar por los audiodramas que desean que sean traducidos según su nivel de suscripción.
            </p>
            <p className="text-center">
              <a href="https://www.patreon.com/pabellonliterario" target="_blank" rel="noopener noreferrer" className="btn btn-info w-100">
                Únete a Patreon
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioDramaList;