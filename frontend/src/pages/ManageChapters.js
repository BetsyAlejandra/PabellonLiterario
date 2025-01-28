import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../styles/ManageChapters.css';

const ManageChapters = () => {
  const { id } = useParams();
  const [audioDrama, setAudioDrama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAudioDrama = async () => {
      try {
        const response = await fetch(`/api/audio-dramas/${id}`);
        if (!response.ok) throw new Error("Error al cargar el audiodrama");
        const data = await response.json();
        setAudioDrama(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAudioDrama();
  }, [id]);

  if (loading) return <p>Cargando audiodrama...</p>;
  if (error) return <p>Error: {error}</p>;

  // Función para agregar temporada
  const addSeason = async (season) => {
    try {
      const response = await fetch(`/api/audio-dramas/${id}/seasons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(season),
      });
      if (!response.ok) throw new Error("Error al agregar temporada");
      const updatedDrama = await response.json();
      setAudioDrama(updatedDrama);
    } catch (err) {
      alert(err.message);
    }
  };

  // Función para agregar capítulo
  const addChapter = async (seasonNumber, chapter) => {
    try {
      const response = await fetch(
        `/api/audio-dramas/${id}/seasons/${seasonNumber}/chapters`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chapter),
        }
      );
      if (!response.ok) throw new Error("Error al agregar capítulo");
      const updatedDrama = await response.json();
      setAudioDrama(updatedDrama);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">{audioDrama.title}</h1>
      <p className="text-center">{audioDrama.description}</p>

      {/* Formulario para agregar temporada */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const season = {
            seasonNumber: e.target.seasonNumber.value,
            title: e.target.title.value,
            description: e.target.description.value,
          };
          addSeason(season);
          e.target.reset();
        }}
        className="mb-4"
      >
        <h3 className="text-lg font-semibold mt-4">Agregar Temporada</h3>
        <div className="mb-3">
          <input
            name="seasonNumber"
            placeholder="Número de temporada"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="title"
            placeholder="Título"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            name="description"
            placeholder="Descripción"
            className="form-control"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Agregar Temporada
        </button>
      </form>

      {/* Mostrar temporadas existentes */}
      {audioDrama.seasons.map((season) => (
        <div key={season.seasonNumber} className="mt-6">
          <h2 className="text-xl font-semibold">Temporada {season.seasonNumber}</h2>
          <ul>
            {season.chapters.length > 0 ? (
              season.chapters.map((chapter, index) => (
                <li key={index} className="text-gray-600">
                  Episodio {chapter.episode}: {chapter.title}
                </li>
              ))
            ) : (
              <p>No hay capítulos en esta temporada.</p>
            )}
          </ul>

          {/* Formulario para agregar capítulos */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const chapter = {
                episode: e.target.episode.value,
                title: e.target.title.value,
                description: e.target.description.value,
                videoLinks: [
                  { platform: "YouTube", url: e.target.url.value },
                ],
              };
              addChapter(season.seasonNumber, chapter);
              e.target.reset();
            }}
            className="mb-4"
          >
            <h3 className="text-lg font-semibold mt-4">Agregar Capítulo</h3>
            <div className="mb-3">
              <input
                name="episode"
                placeholder="Número de episodio"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                name="title"
                placeholder="Título"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                name="description"
                placeholder="Descripción"
                className="form-control"
              ></textarea>
            </div>
            <div className="mb-3">
              <input
                name="url"
                placeholder="URL del video"
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Agregar
            </button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default ManageChapters;