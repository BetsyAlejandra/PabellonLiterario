import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EpisodesPage = () => {
  const { season } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(`/api/audio-dramas/season/${season}`);
        const data = await response.json();
        setEpisodes(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchEpisodes();
  }, [season]);

  const handleEpisodeClick = (episodeId) => {
    navigate(`/audio-dramas/episode/${episodeId}`);
  };

  return (
    <div className="container">
      <h1>Temporada {season}</h1>
      <ul className="list-group mt-4">
        {episodes.map((episode) => (
          <li
            key={episode._id}
            className="list-group-item d-flex justify-content-between align-items-center"
            onClick={() => handleEpisodeClick(episode._id)}
            style={{ cursor: 'pointer' }}
          >
            {episode.episode}. {episode.title}
            <span className="badge bg-primary rounded-pill">Ver</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpisodesPage;