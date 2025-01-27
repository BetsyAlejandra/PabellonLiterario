import React, { useState } from 'react';

const AudioDramaForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    season: '',
    episode: '',
    videoLinks: [{ platform: '', url: '' }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVideoLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.videoLinks];
    updatedLinks[index][field] = value;
    setFormData({ ...formData, videoLinks: updatedLinks });
  };

  const addVideoLink = () => {
    setFormData({
      ...formData,
      videoLinks: [...formData.videoLinks, { platform: '', url: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/audio-dramas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al subir el audio drama');

      alert('Audio drama subido con éxito');
      setFormData({
        title: '',
        description: '',
        season: '',
        episode: '',
        videoLinks: [{ platform: '', url: '' }],
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2>Subir Audio Drama</h2>

      <div className="mb-3">
        <label>Título</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label>Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Temporada</label>
        <input
          type="number"
          name="season"
          value={formData.season}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label>Episodio</label>
        <input
          type="number"
          name="episode"
          value={formData.episode}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label>Enlaces de video</label>
        {formData.videoLinks.map((link, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              placeholder="Plataforma (ej: Dailymotion)"
              value={link.platform}
              onChange={(e) =>
                handleVideoLinkChange(index, 'platform', e.target.value)
              }
              className="form-control mb-2"
              required
            />
            <input
              type="text"
              placeholder="URL"
              value={link.url}
              onChange={(e) =>
                handleVideoLinkChange(index, 'url', e.target.value)
              }
              className="form-control"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addVideoLink}
          className="btn btn-secondary mt-2"
        >
          Agregar otro enlace
        </button>
      </div>

      <button type="submit" className="btn btn-primary">
        Subir
      </button>
    </form>
  );
};

export default AudioDramaForm;