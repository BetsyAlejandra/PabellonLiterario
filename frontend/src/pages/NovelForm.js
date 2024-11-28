import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const NovelForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState([]);
  const [classification, setClassification] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverImage || !title || !description || genres.length === 0 || !classification) {
      setMessage('Por favor, completa todos los campos requeridos.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('genres', genres);
    formData.append('classification', classification);
    formData.append('tags', tags.split(',').map(tag => tag.trim()));
    formData.append('coverImage', coverImage);

    try {
      setLoading(true);
      const res = await axios.post('https://pabellonliterario.com/api/novels/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('¡Novela creada exitosamente!');
      setTitle('');
      setDescription('');
      setGenres([]);
      setClassification('');
      setTags('');
      setCoverImage(null);
      setPreviewImage(null);

      setTimeout(() => {
        navigate('/my-stories');
      }, 2000);
    } catch (error) {
      setLoading(false);
      setMessage(error.response ? `Error en el backend: ${error.response.data.message}` : `Error: ${error.message}`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleGenresChange = (e) => {
    const selectedGenres = Array.from(e.target.selectedOptions, option => option.value);
    setGenres(selectedGenres);
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
                  className="form-control custom-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Introduce el título de la novela"
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="description">Sinopsis:</label>
                <textarea
                  id="description"
                  className="form-control custom-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Escribe una breve sinopsis de tu novela"
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="genres">Género:</label>
                <select
                  id="genres"
                  className="form-control custom-input"
                  onChange={handleGenresChange}
                  multiple
                  required
                >
                  <option value="Fantasía">Fantasía</option>
                  <option value="Romance">Romance</option>
                  <option value="Ciencia ficción">Ciencia ficción</option>
                  <option value="Drama">Drama</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Terror">Terror</option>
                  <option value="Suspenso">Suspenso</option>
                  <option value="Comedia">Comedia</option>
                  <option value="Histórico">Histórico</option>
                  <option value="Misterio">Misterio</option>
                  <option value="Poesía">Poesía</option>
                  <option value="Distopía">Distopía</option>
                </select>
              </div>

              <div className="form-group mt-3">
                <label htmlFor="classification">Clasificación:</label>
                <select
                  id="classification"
                  className="form-control custom-input"
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
                  className="form-control custom-input"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Ejemplo: Aventura, magia, amor"
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

        <div className="col-md-4">
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
              className="form-control-file mt-4 custom-file-input"
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