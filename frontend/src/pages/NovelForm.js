import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const NovelForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState('');
  const [subGenres, setSubGenres] = useState('');
  const [classification, setClassification] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [collaborators, setCollaborators] = useState([{ name: '', role: '' }]);
  const [adaptations, setAdaptations] = useState([{ type: '', title: '', releaseDate: '', link: '' }]);
  const [awards, setAwards] = useState([{ title: '', year: '', organization: '' }]);
  const [progress, setProgress] = useState('En progreso');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Maneja el envío del formulario
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
    formData.append('subGenres', subGenres.split(',').map(subGenre => subGenre.trim()));
    formData.append('classification', classification);
    formData.append('tags', tags.split(',').map(tag => tag.trim()));
    formData.append('coverImage', coverImage);
    formData.append('collaborators', JSON.stringify(collaborators));
    formData.append('adaptations', JSON.stringify(adaptations));
    formData.append('awards', JSON.stringify(awards));
    formData.append('progress', progress);

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
      setGenres('');
      setSubGenres('');
      setClassification('');
      setTags('');
      setCoverImage(null);
      setPreviewImage(null);
      setCollaborators([{ name: '', role: '' }]);
      setAdaptations([{ type: '', title: '', releaseDate: '', link: '' }]);
      setAwards([{ title: '', year: '', organization: '' }]);
      setProgress('En progreso');

      setTimeout(() => {
        navigate('/my-stories');
      }, 2000);
    } catch (error) {
      setLoading(false);
      setMessage(error.response ? `Error en el backend: ${error.response.data.message}` : `Error: ${error.message}`);
    }
  };

  // Maneja la selección de la imagen de portada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Agregar o eliminar colaboradores
  const handleCollaboratorChange = (index, e) => {
    const { name, value } = e.target;
    const newCollaborators = [...collaborators];
    newCollaborators[index][name] = value;
    setCollaborators(newCollaborators);
  };

  const addCollaborator = () => {
    setCollaborators([...collaborators, { name: '', role: '' }]);
  };

  const removeCollaborator = (index) => {
    const newCollaborators = [...collaborators];
    newCollaborators.splice(index, 1);
    setCollaborators(newCollaborators);
  };

  // Agregar o eliminar adaptaciones
  const handleAdaptationChange = (index, e) => {
    const { name, value } = e.target;
    const newAdaptations = [...adaptations];
    newAdaptations[index][name] = value;
    setAdaptations(newAdaptations);
  };

  const addAdaptation = () => {
    setAdaptations([...adaptations, { type: '', title: '', releaseDate: '', link: '' }]);
  };

  const removeAdaptation = (index) => {
    const newAdaptations = [...adaptations];
    newAdaptations.splice(index, 1);
    setAdaptations(newAdaptations);
  };

  // Agregar o eliminar premios
  const handleAwardChange = (index, e) => {
    const { name, value } = e.target;
    const newAwards = [...awards];
    newAwards[index][name] = value;
    setAwards(newAwards);
  };

  const addAward = () => {
    setAwards([...awards, { title: '', year: '', organization: '' }]);
  };

  const removeAward = (index) => {
    const newAwards = [...awards];
    newAwards.splice(index, 1);
    setAwards(newAwards);
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
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
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
                <label htmlFor="subGenres">Subgéneros:</label>
                <input
                  type="text"
                  id="subGenres"
                  className="form-control custom-input"
                  value={subGenres}
                  onChange={(e) => setSubGenres(e.target.value)}
                  placeholder="Subgéneros separados por coma"
                />
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

              <div className="form-group mt-3">
                <label>Colaboradores:</label>
                {collaborators.map((collaborator, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre"
                      value={collaborator.name}
                      onChange={(e) => handleCollaboratorChange(index, e)}
                    />
                    <input
                      type="text"
                      name="role"
                      placeholder="Rol"
                      value={collaborator.role}
                      onChange={(e) => handleCollaboratorChange(index, e)}
                    />
                    <button type="button" className="remove-button" onClick={() => removeCollaborator(index)}>Eliminar</button>
                  </div>
                ))}
                <button type="button" className="add-button" onClick={addCollaborator}>Añadir Colaborador</button>
              </div>

              <div className="form-group mt-3">
                <label>Adaptaciones:</label>
                {adaptations.map((adaptation, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name="type"
                      placeholder="Tipo (ej. Película)"
                      value={adaptation.type}
                      onChange={(e) => handleAdaptationChange(index, e)}
                    />
                    <input
                      type="text"
                      name="title"
                      placeholder="Título"
                      value={adaptation.title}
                      onChange={(e) => handleAdaptationChange(index, e)}
                    />
                    <input
                      type="text"
                      name="releaseDate"
                      placeholder="Fecha de Lanzamiento"
                      value={adaptation.releaseDate}
                      onChange={(e) => handleAdaptationChange(index, e)}
                    />
                    <input
                      type="url"
                      name="link"
                      placeholder="Enlace"
                      value={adaptation.link}
                      onChange={(e) => handleAdaptationChange(index, e)}
                    />
                    <button type="button" className="remove-button" onClick={() => removeAdaptation(index)}>Eliminar</button>
                  </div>
                ))}
                <button type="button" className="add-button" onClick={addAdaptation}>Añadir Adaptación</button>
              </div>

              <div className="form-group mt-3">
                <label>Premios:</label>
                {awards.map((award, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name="title"
                      placeholder="Título del premio"
                      value={award.title}
                      onChange={(e) => handleAwardChange(index, e)}
                    />
                    <input
                      type="text"
                      name="year"
                      placeholder="Año"
                      value={award.year}
                      onChange={(e) => handleAwardChange(index, e)}
                    />
                    <input
                      type="text"
                      name="organization"
                      placeholder="Organización"
                      value={award.organization}
                      onChange={(e) => handleAwardChange(index, e)}
                    />
                    <button type="button" className="remove-button" onClick={() => removeAward(index)}>Eliminar</button>
                  </div>
                ))}
                <button type="button" className="add-button" onClick={addAward}>Añadir Premio</button>
              </div>

              <div className="form-group mt-3">
                <label htmlFor="progress">Estado de progreso:</label>
                <select
                  id="progress"
                  className="form-control custom-input"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  required
                >
                  <option value="En progreso">En progreso</option>
                  <option value="Finalizada">Finalizada</option>
                  <option value="Pausada">Pausada</option>
                </select>
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
            <label htmlFor="coverImage" className="file-input-label">Elegir Portada</label>
            <input
              type="file"
              id="coverImage"
              className="form-control-file mt-4 custom-file-input"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={{ display: 'none' }}  // Ocultar el input file real
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelForm;
