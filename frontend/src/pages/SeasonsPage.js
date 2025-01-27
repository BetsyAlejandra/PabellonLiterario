import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SeasonsPage = () => {
  const [seasons, setSeasons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch('/api/audio-dramas/seasons'); // Endpoint para obtener las temporadas
        const data = await response.json();
        setSeasons(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchSeasons();
  }, []);

  const handleSeasonClick = (season) => {
    navigate(`/audio-dramas/season/${season}`);
  };

  return (
    <div className="container">
      <h1>Audio Dramas: Temporadas</h1>
      <div className="row">
        {seasons.map((season) => (
          <div key={season} className="col-md-3 mb-4">
            <div
              className="card text-center cursor-pointer"
              onClick={() => handleSeasonClick(season)}
            >
              <div className="card-body">
                <h5 className="card-title">Temporada {season}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonsPage;