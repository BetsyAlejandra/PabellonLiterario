import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../styles/ManageChapters.css'

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{audioDrama.title}</h1>
      <p>{audioDrama.description}</p>

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
      >
        <h3 className="text-lg font-semibold mt-4">Agregar Temporada</h3>
        <input
          name="seasonNumber"
          placeholder="Número de temporada"
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          name="title"
          placeholder="Título"
          className="border p-2 mb-2 w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          className="border p-2 mb-2 w-full"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
        >
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
                  // Puedes agregar más plataformas de video aquí
                ],
              };
              addChapter(season.seasonNumber, chapter);
              e.target.reset();
            }}
          >
            <h3 className="text-lg font-semibold mt-4">Agregar Capítulo</h3>
            <input
              name="episode"
              placeholder="Número de episodio"
              className="border p-2 mb-2 w-full"
              required
            />
            <input
              name="title"
              placeholder="Título"
              className="border p-2 mb-2 w-full"
              required
            />
            <textarea
              name="description"
              placeholder="Descripción"
              className="border p-2 mb-2 w-full"
            ></textarea>
            <input
              name="url"
              placeholder="URL del video"
              className="border p-2 mb-2 w-full"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
            >
              Agregar
            </button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default ManageChapters;