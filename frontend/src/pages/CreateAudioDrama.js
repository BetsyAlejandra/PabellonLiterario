import React, { useState } from 'react';
import '../styles/CreateAudioDrama.css';

const CreateAudioDrama = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genres: '',
    progress: 'En progreso',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/audio-dramas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          genres: formData.genres.split(',').map((genre) => genre.trim()),
        }),
      });

      if (response.ok) {
        alert('Audiodrama creado exitosamente.');
        setFormData({ title: '', description: '', genres: '', progress: 'En progreso' });
      } else {
        alert('Error al crear el audiodrama.');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <div className="create-audio-drama container">
      <h1 className="title">Crear Audiodrama</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Géneros (separados por comas)</label>
          <input
            type="text"
            name="genres"
            value={formData.genres}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Progreso</label>
          <select name="progress" value={formData.progress} onChange={handleChange}>
            <option value="En progreso">En progreso</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Pausado">Pausado</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Crear</button>
      </form>
    </div>
  );
};

export default CreateAudioDrama;