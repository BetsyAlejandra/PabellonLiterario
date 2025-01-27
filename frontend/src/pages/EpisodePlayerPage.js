import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { DiscussionEmbed, CommentCount } from 'disqus-react';

const EpisodePlayerPage = () => {
  const { episodeId } = useParams();
  const [episode, setEpisode] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState('');

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await fetch(`/api/audio-dramas/episode/${episodeId}`);
        const data = await response.json();
        setEpisode(data);
        if (data.videoLinks.length > 0) {
          setSelectedVideo(data.videoLinks[0].url);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchEpisode();
  }, [episodeId]);

  if (!episode) return <p>Cargando...</p>;

  return (
    <div className="container">
      <h1>{episode.title}</h1>
      <p>{episode.description}</p>

      {/* Selector de reproductor */}
      <div className="mb-3">
        <label>Selecciona un reproductor:</label>
        <select
          value={selectedVideo}
          onChange={(e) => setSelectedVideo(e.target.value)}
          className="form-select"
        >
          {episode.videoLinks.map((link, index) => (
            <option key={index} value={link.url}>
              {link.platform}
            </option>
          ))}
        </select>
      </div>

      {/* Reproductor */}
      <div className="video-container mb-4">
        <iframe
          src={selectedVideo}
          title={episode.title}
          width="100%"
          height="500px"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>

      {/* Botón de "me gusta" */}
      <button
        onClick={async () => {
          try {
            await fetch(`/api/audio-dramas/${episode._id}/like`, {
              method: 'PATCH',
            });
            alert('¡Gracias por tu me gusta!');
          } catch (err) {
            console.error(err.message);
          }
        }}
        className="btn btn-outline-primary"
      >
        Me gusta ({episode.likes})
      </button>
      <Container className="general-comments">
        <h3>Comentarios del capítulo</h3>
        <DiscussionEmbed
          shortname="pabellonliterario"
          config={{
            url: `${window.location.origin}/audio-dramas/episode/${episodeId}`,
            identifier: `${episodeId}`,
            language: 'es',
          }}
        />
      </Container>
    </div>

  );
};

export default EpisodePlayerPage;