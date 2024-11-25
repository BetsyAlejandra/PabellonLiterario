import React, { useState } from 'react';
import axios from 'axios';

const NovelForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState('');
  const [classification, setClassification] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('genres', genres);
    formData.append('classification', classification);
    formData.append('coverImage', coverImage);

    try {
      const res = await axios.post('/api/novels/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Novela creada:', res.data);
    } catch (error) {
      console.error('Error al crear la novela:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Sinopsis:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Géneros (separados por comas):</label>
        <input type="text" value={genres} onChange={(e) => setGenres(e.target.value)} required />
      </div>
      <div>
        <label>Clasificación:</label>
        <select value={classification} onChange={(e) => setClassification(e.target.value)} required>
          <option value="">Seleccione</option>
          <option value="+18">+18</option>
          <option value="General">General</option>
        </select>
      </div>
      <div>
        <label>Portada:</label>
        <input type="file" onChange={(e) => setCoverImage(e.target.files[0])} required />
      </div>
      <button type="submit">Crear Novela</button>
    </form>
  );
};

export default NovelForm;
