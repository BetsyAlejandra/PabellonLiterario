import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import '../styles/global.css';

const NovelForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success'); // Estado inicial

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/api/novels/genres');
        setGenres(response.data); // Guarda los géneros obtenidos
      } catch (error) {
        console.error('Error al obtener los géneros:', error.message);
      }
    };

    fetchGenres();
  }, []);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Género seleccionado:', selectedGenre);
  
    if (!coverImage || !title || !description || selectedGenre.length === 0 || !classification) {
      setModalMessage('Por favor, completa todos los campos obligatorios.');
      setModalType('error');
      setShowModal(true);
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('genres', JSON.stringify([selectedGenre])); // Convertir el género seleccionado en un arreglo y serializarlo como JSON
    formData.append('subGenres', JSON.stringify(subGenres.split(',').map((subGenre) => subGenre.trim())));
    formData.append('classification', classification);
    formData.append('tags', JSON.stringify(tags.split(',').map((tag) => tag.trim())));
    formData.append('coverImage', coverImage);
    formData.append('collaborators', JSON.stringify(collaborators));
    formData.append('adaptations', JSON.stringify(adaptations));
    formData.append('awards', JSON.stringify(awards));
    formData.append('progress', progress);
  
    try {
      setLoading(true);
      const res = await axios.post('/api/novels/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Incluye cookies de sesión
      });
  
      setModalMessage('¡Novela creada exitosamente!');
      setModalType('success');
      setShowModal(true);
  
      setTimeout(() => {
        navigate('/my-stories');
      }, 2000);
    } catch (error) {
      setModalMessage(`Error al crear la novela: ${error.response?.data.message || error.message}`);
      setModalType('error');
      setShowModal(true);
      setLoading(false);
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

  // Cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage('');
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
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className={modalType === 'success' ? 'modal-success' : 'modal-error'}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'success' ? '¡Éxito!' : 'Error'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            variant={modalType === 'success' ? 'success' : 'danger'}
            onClick={handleCloseModal}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="row">
        <div className="col-md-8">
          <div className="novel-form-card">
            <h2 className="text-center">Crear Nueva Novela</h2>
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
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    setGenres([e.target.value]); // Asegúrate de que genres tenga el género seleccionado
                  }}
                  required
                >
                  <option value="">Selecciona un género</option>
                  {genres.map((genre, index) => (
                    <option key={index} value={genre}>
                      {genre}
                    </option>
                  ))}
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
                <label>Adaptaciones, Raw (Novela Original)</label>
                {adaptations.map((adaptation, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name="type"
                      placeholder="Tipo (ej. jjwxc)"
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
