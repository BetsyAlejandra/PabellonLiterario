import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ManageChapters.css';

const ManageChapters = () => {
  const { id } = useParams(); // ID del audiodrama
  const [audioDrama, setAudioDrama] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [chapterData, setChapterData] = useState({
    episode: '',
    title: '',
    description: '',
    videoLinks: '',
  });

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

  const handleSeasonSelect = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
  };

  const handleChange = (e) => {
    setChapterData({ ...chapterData, [e.target.name]: e.target.value });
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();

    if (!selectedSeason) {
      alert('Selecciona una temporada primero.');
      return;
    }

    try {
      const response = await fetch(`/api/audio-dramas/${id}/seasons/${selectedSeason}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...chapterData,
          videoLinks: [{ platform: 'Dailymotion', url: chapterData.videoLinks }],
        }),
      });

      if (response.ok) {
        alert('Capítulo agregado exitosamente.');
        setChapterData({ episode: '', title: '', description: '', videoLinks: '' });
      } else {
        alert('Error al agregar el capítulo.');
      }
    } catch (error) {
      console.error('Error al agregar el capítulo:', error);
    }
  };

  if (!audioDrama) {
    return <p>Cargando detalles...</p>;
  }

  return (
    <div className="manage-chapters container">
      <h1 className="title">Administrar Capítulos de {audioDrama.title}</h1>
      <h2>Temporadas</h2>
      <div className="season-list">
        {audioDrama.seasons.map((season) => (
          <button
            key={season.seasonNumber}
            className={`season-button ${selectedSeason === season.seasonNumber ? 'active' : ''}`}
            onClick={() => handleSeasonSelect(season.seasonNumber)}
          >
            Temporada {season.seasonNumber}
          </button>
        ))}
      </div>

      {selectedSeason && (
        <div className="add-chapter">
          <h2>Agregar Capítulo a la Temporada {selectedSeason}</h2>
          <form onSubmit={handleAddChapter}>
            <div className="form-group">
              <label>Episodio</label>
              <input
                type="number"
                name="episode"
                value={chapterData.episode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                name="title"
                value={chapterData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                value={chapterData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Enlace de Video</label>
              <input
                type="url"
                name="videoLinks"
                value={chapterData.videoLinks}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Agregar Capítulo</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageChapters;