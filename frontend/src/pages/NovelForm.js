import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css'

const NovelForm = () => {
  const navigate = useNavigate(); // Hook de navegación
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState('');
  const [classification, setClassification] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverImage || !title || !description || !genres || !classification) {
      setMessage('Por favor, completa todos los campos requeridos.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('genres', genres);
    formData.append('classification', classification);
    formData.append('tags', tags);
    formData.append('coverImage', coverImage);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/novels/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('¡Novela creada exitosamente!');
      setTitle('');
      setDescription('');
      setGenres('');
      setClassification('');
      setTags('');
      setCoverImage(null);
      setPreviewImage(null);
      // Redirigir a la página de Mis historias
      setTimeout(() => {
        navigate('/my-stories');
      }, 2000);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setMessage(`Error en el backend: ${error.response.data.message}`);
      } else if (error.request) {
        setMessage('No se recibió respuesta del servidor.');
      } else {
        setMessage(`Error en la solicitud: ${error.message}`);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8">
          <div className="novel-form-card">
            <h2 className="text-center">Crear Nueva Novela</h2>
            {message && <div className="alert alert-info mt-3">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group mt-3">
                <label htmlFor="title">Título:</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="description">Sinopsis:</label>
                <textarea
                  id="description"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="genres">Género:</label>
                <select
                  id="genres"
                  className="form-control"
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Fantasia">Fantasía</option>
                  <option value="Romance">Romance</option>
                  <option value="Ciencia ficción">Ciencia ficción</option>
                  <option value="Drama">Drama</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Terror">Terror</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="classification">Clasificación:</label>
                <select
                  id="classification"
                  className="form-control"
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="+18">+18</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="tags">Etiquetas (separadas por comas):</label>
                <input
                  type="text"
                  id="tags"
                  className="form-control"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline-light mt-4 w-100"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Novela'}
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-center justify-content-center">
          <div className="novel-preview">
            <h5>Vista Previa de la Portada</h5>
            <div className="mt-3">
              {previewImage ? (
                <img src={previewImage} alt="Vista previa de la portada" className="novel-cover" />
              ) : (
                <p>Selecciona una imagen para la portada</p>
              )}
            </div>
            <input
              type="file"
              id="coverImage"
              className="form-control-file mt-4"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default NovelForm;
