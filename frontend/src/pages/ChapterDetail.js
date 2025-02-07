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
    <div className="chapter-detail container py-5">
      <h1 className="chapter-title text-center mb-4">{chapter.title}</h1>

      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3101266953328074"
        crossorigin="anonymous"></script>

      {videoId && <DailymotionPlayer videoId={videoId} />}

      <div className="chapter-navigation d-flex justify-content-between mt-4">
        {getPreviousChapter() && (
          <Link to={`/audio-dramas/${id}/seasons/${seasonNumber}/episodes/${getPreviousChapter().episode}`} className="btn btn-outline-dark shadow-sm">
            Capítulo Anterior
          </Link>
        )}
        {getNextChapter() && (
          <Link to={`/audio-dramas/${id}/seasons/${seasonNumber}/episodes/${getNextChapter().episode}`} className="btn btn-outline-dark shadow-sm">
            Siguiente Capítulo
          </Link>
        )}
      </div>

      <div className="patreon-info text-center my-5">
        <p className="font-weight-bold text-dark">
          Para ver capítulos más avanzados, únete a nuestro{' '}
          <a href="https://www.patreon.com/pabellonliterario" target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-lg">
            ¡Patreon!
          </a>
        </p>
      </div>

      <div className="back-button text-center mt-5">
        <Link to={`/audiodrama/${id}`} className="btn btn-primary btn-lg">
          Volver al Audiodrama
        </Link>
      </div>

      <DiscussionEmbed {...disqusConfig} />
    </div>
  );
};

export default ChapterDetail;