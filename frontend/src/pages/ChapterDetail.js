import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DiscussionEmbed } from 'disqus-react';
import '../styles/ChapterDetail.css';

const ChapterDetail = () => {
  const { id, seasonNumber, episode } = useParams(); // Obtener el ID del audio drama, temporada y capítulo desde la URL
  const [chapter, setChapter] = useState(null);
  const [audioDrama, setAudioDrama] = useState(null);

  useEffect(() => {
    const fetchAudioDramaDetails = async () => {
      try {
        const response = await fetch(`/api/audio-dramas/${id}`);
        const data = await response.json();
        setAudioDrama(data);

        // Buscar el capítulo específico
        const season = data.seasons.find((season) => season.seasonNumber === parseInt(seasonNumber));
        const selectedChapter = season.chapters.find((chapter) => chapter.episode === parseInt(episode));
        setChapter(selectedChapter);
      } catch (error) {
        console.error('Error al cargar los detalles del capítulo:', error);
      }
    };

    fetchAudioDramaDetails();
  }, [id, seasonNumber, episode]);

  if (!chapter) {
    return <p>Cargando detalles del capítulo...</p>;
  }

  const getDailymotionEmbedUrl = (videoUrl) => {
    const videoId = videoUrl.split("/")[4]; // Extraer el ID del video
    return `https://www.dailymotion.com/embed/video/${videoId}`;
  };

  const disqusConfig = {
    shortname: 'pabellonliterario',
    config: {
      url: window.location.href, 
      identifier: `${id}-${seasonNumber}-${episode}`,
      title: `${audioDrama.title} - Episodio ${episode}`,
      language: 'es',
    },
  };

  const getNextChapter = () => {
    const season = audioDrama.seasons.find((season) => season.seasonNumber === parseInt(seasonNumber));
    const nextEpisode = season.chapters.find((ch) => ch.episode === parseInt(episode) + 1);
    return nextEpisode;
  };

  const getPreviousChapter = () => {
    const season = audioDrama.seasons.find((season) => season.seasonNumber === parseInt(seasonNumber));
    const previousEpisode = season.chapters.find((ch) => ch.episode === parseInt(episode) - 1);
    return previousEpisode;
  };

  return (
    <div className="chapter-detail container">
      <h1 className="chapter-title">{chapter.title}</h1>

      {/* Reproductor de Dailymotion */}
      <iframe
        width="100%"
        height="480"
        src={getDailymotionEmbedUrl(chapter.videoLinks[0].url)}
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        title={chapter.title}
      />

      {/* Navegación entre capítulos */}
      <div className="chapter-navigation">
        {getPreviousChapter() && (
          <Link to={`/audio-dramas/${id}/seasons/${seasonNumber}/episodes/${getPreviousChapter().episode}`} className="nav-link">
            Capítulo Anterior
          </Link>
        )}
        {getNextChapter() && (
          <Link to={`/audio-dramas/${id}/seasons/${seasonNumber}/episodes/${getNextChapter().episode}`} className="nav-link">
            Siguiente Capítulo
          </Link>
        )}
      </div>

      {/* Sección de comentarios con Disqus */}
      <DiscussionEmbed {...disqusConfig} />
    </div>
  );
};

export default ChapterDetail;