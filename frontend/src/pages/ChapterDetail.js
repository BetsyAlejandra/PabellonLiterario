import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DiscussionEmbed } from 'disqus-react';
import DailymotionPlayer from '../Components/DailymotionPlayer';
import '../styles/ChapterDetail.css';

const ChapterDetail = () => {
  const { id, seasonNumber, episode } = useParams();
  const [chapter, setChapter] = useState(null);
  const [audioDrama, setAudioDrama] = useState(null);

  useEffect(() => {
    const fetchAudioDramaDetails = async () => {
      try {
        const response = await fetch(`/api/audio-dramas/${id}`);
        const data = await response.json();
        setAudioDrama(data);

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

  const getDailymotionVideoId = (videoUrl) => {
    const regex = /(?:dai\.ly\/)([a-zA-Z0-9_-]+)/;
    const match = videoUrl.match(regex);
  
    if (match) {
      return match[1];
    } else {
      console.error('URL de Dailymotion no válida.');
      return null;
    }
  };

  const videoId = getDailymotionVideoId(chapter.videoLinks[0].url);
  

  return (
    <div className="chapter-detail container">
      <h1 className="chapter-title">{chapter.title}</h1>


      {videoId && <DailymotionPlayer videoId={videoId} />}

      {/* Botón de retroceso */}
      <Link to={`/audiodrama/${id}`} className="back-button">
        <button className="btn-back">Volver al Audiodrama</button>
      </Link>

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

      <DiscussionEmbed {...disqusConfig} />
    </div>
  );
};

export default ChapterDetail;