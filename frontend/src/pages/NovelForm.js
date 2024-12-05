import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Table } from 'react-bootstrap';
import '../styles/global.css';

const GENRES = [
  'Fantasía', 'Acción', 'Supernatural', 'Xuanhuan', 'Transmigración',
  'Moderno', 'Policial', 'Entretenimiento', 'Transmigración Rápida',
  'M-preg', 'Interestelar', 'Renacimiento', 'Xianxia', 'Romance',
  'Ciencia ficción', 'Drama', 'Aventura', 'Terror', 'Suspenso',
  'Comedia', 'Histórico', 'Misterio', 'Poesía', 'Distopía',
];

const SUBGENRES = [
  'Adaptado a Drama CD', 'Adaptado a Manhua', 'Amnesia', 'China Antigua',
  'Cambios de Apariencia', 'Buddhismo', 'Cultivación', 'Protagonista Inteligente',
  'Intereses Amorosos Fuertes', 'Dragones', 'Fantasmas', 'Animales Mágicos',
  'Formaciones Mágicas', 'Feng Shui', 'Relaciones No-Humanas',
];

const ADAPTATION_TYPES = [
  'Audio-Drama', 'Manhua', 'Manwha', 'Manga', 'K-Drama', 'Dorama',
  'Película', 'Donghua', 'Anime', 'Videojuego',
];

const LANGUAGES = ['Japonés', 'Chino', 'Coreano', 'Inglés'];

// Asegúrate de definir este arreglo antes de usarlo
const ROLES = ['Traductor', 'Editor', 'Ilustrador', 'Corrector'];

const NovelForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [subGenres, setSubGenres] = useState([]);
  const [classification, setClassification] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [collaborators, setCollaborators] = useState([{ username: '', role: '' }]);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [adaptations, setAdaptations] = useState([{ type: '', link: '' }]);
  const [rawOrigin, setRawOrigin] = useState({ origin: '', link: '' });
  const [languageOrigin, setLanguageOrigin] = useState('');
  const [password, setPassword] = useState('');
  const [progress, setProgress] = useState('En progreso');
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const [showSubGenreModal, setShowSubGenreModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  const closeSubGenreModal = () => {
    setShowSubGenreModal(false);
  };

  const validateCollaborators = () => {
    return collaborators.every(
      (collaborator) => collaborator.username.trim() !== '' && collaborator.role.trim() !== ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !coverImage ||
      !title ||
      !description ||
      !selectedGenre ||
      !classification ||
      !languageOrigin
    ) {
      setModalMessage('Por favor, completa todos los campos obligatorios.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    if (languageOrigin === 'Coreano' && !password) {
      setModalMessage('Por favor, configura una contraseña para las novelas en coreano.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    if (subGenres.length > 15) {
      setModalMessage('Solo puedes seleccionar hasta 15 subgéneros.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    if (!validateCollaborators()) {
      setModalMessage('Todos los colaboradores deben tener un nombre de usuario y un rol.');
      setModalType('error');
      setShowModal(true);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('genres', selectedGenre);
    formData.append('subGenres', JSON.stringify(subGenres));
    formData.append('classification', classification);
    formData.append('tags', JSON.stringify(tags.split(',').map((tag) => tag.trim())));
    formData.append('coverImage', coverImage);
    formData.append('collaborators', JSON.stringify(collaborators));
    formData.append('adaptations', JSON.stringify(adaptations));
    formData.append('rawOrigin', JSON.stringify(rawOrigin));
    formData.append('languageOrigin', languageOrigin);
    formData.append('progress', progress);

    try {
      setLoading(true);
      await axios.post('/api/novels/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      setModalMessage('¡Novela creada exitosamente!');
      setModalType('success');
      setShowModal(true);
      resetForm();

      setTimeout(() => navigate('/my-stories'), 2000);
    } catch (error) {
      setModalMessage(`Error al crear la novela: ${error.response?.data.message || error.message}`);
      setModalType('error');
      setShowModal(true);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedGenre('');
    setSubGenres([]);
    setClassification('');
    setTags('');
    setCoverImage(null);
    setPreviewImage(null);
    setCollaborators([{ username: '', role: '' }]);
    setAdaptations([{ type: '', link: '' }]);
    setRawOrigin({ origin: '', link: '' });
    setLanguageOrigin('');
    setProgress('En progreso');
  };

  const handleCollaboratorChange = async (index, key, value) => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index][key] = value;

    if (key === 'username' && value.length > 2) {
      const { data } = await axios.get(`/api/users/suggestions?name=${value}`);
      setUserSuggestions(data);
    }

    setCollaborators(updatedCollaborators);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setModalMessage('El archivo seleccionado supera el tamaño máximo permitido de 5MB.');
        setModalType('error');
        setShowModal(true);
      } else {
        setCoverImage(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    }
  };

  const toggleSubGenre = (subGenre) => {
    if (subGenres.includes(subGenre)) {
      setSubGenres(subGenres.filter((sg) => sg !== subGenre));
    } else if (subGenres.length < 15) {
      setSubGenres([...subGenres, subGenre]);
    }
  };

  return (
    <div className="container my-5">
      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'success' ? '¡Éxito!' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para subgéneros */}
      <Modal show={showSubGenreModal} onHide={closeSubGenreModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona Subgéneros</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <tbody>
              {SUBGENRES.map((subGenre) => (
                <tr key={subGenre}>
                  <td>
                    <input
                      type="checkbox"
                      checked={subGenres.includes(subGenre)}
                      onChange={() => toggleSubGenre(subGenre)}
                    />
                  </td>
                  <td>{subGenre}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeSubGenreModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <h2>Crear Nueva Novela</h2>

        {/* Título */}
        <label>Título</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        {/* Sinopsis */}
        <label>Sinopsis</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        {/* Idioma de origen */}
        <label>Idioma de Origen</label>
        <select value={languageOrigin} onChange={(e) => setLanguageOrigin(e.target.value)} required>
          <option value="">Selecciona un idioma</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        {languageOrigin === 'Coreano' && (
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        {/* Portada */}
        <label>Portada</label>
        <input type="file" onChange={handleImageChange} accept="image/*" required />

        {/* Género */}
        <label>Género</label>
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} required>
          <option value="">Selecciona un género</option>
          {GENRES.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        {/* Subgéneros */}
        <label>Subgéneros (hasta 15)</label>
        <Button onClick={() => setShowSubGenreModal(true)}>Seleccionar Subgéneros</Button>

        {/* Colaboradores */}
        <label>Colaboradores</label>
        {collaborators.map((collaborator, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Usuario"
              list={`user-suggestions-${index}`}
              value={collaborator.username}
              onChange={(e) => handleCollaboratorChange(index, 'username', e.target.value)}
            />
            <datalist id={`user-suggestions-${index}`}>
              {userSuggestions.map((user) => (
                <option key={user.id} value={user.username} />
              ))}
            </datalist>

            <select
              value={collaborator.role}
              onChange={(e) => handleCollaboratorChange(index, 'role', e.target.value)}
            >
              <option value="">Selecciona un rol</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setCollaborators([...collaborators, { username: '', role: '' }])}
        >
          Añadir Colaborador
        </button>

        {/* Adaptaciones */}
        <label>Adaptaciones</label>
        {adaptations.map((adaptation, index) => (
          <div key={index}>
            <select
              value={adaptation.type}
              onChange={(e) =>
                setAdaptations((prev) =>
                  prev.map((ad, i) => (i === index ? { ...ad, type: e.target.value } : ad))
                )
              }
            >
              <option value="">Selecciona un tipo</option>
              {ADAPTATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="url"
              value={adaptation.link}
              onChange={(e) =>
                setAdaptations((prev) =>
                  prev.map((ad, i) => (i === index ? { ...ad, link: e.target.value } : ad))
                )
              }
              placeholder="Enlace"
            />
          </div>
        ))}
        <button type="button" onClick={() => setAdaptations([...adaptations, { type: '', link: '' }])}>
          Añadir Adaptación
        </button>

        {/* Enlace a la novela de origen */}
        <label>Enlace a la Novela de Origen</label>
        <input
          type="text"
          value={rawOrigin.origin}
          onChange={(e) => setRawOrigin((prev) => ({ ...prev, origin: e.target.value }))}
          placeholder="Nombre de la novela original"
        />
        <input
          type="url"
          value={rawOrigin.link}
          onChange={(e) => setRawOrigin((prev) => ({ ...prev, link: e.target.value }))}
          placeholder="Enlace a la novela original"
        />

        {/* Estado */}
        <label>Estado</label>
        <select value={progress} onChange={(e) => setProgress(e.target.value)} required>
          <option value="En progreso">En progreso</option>
          <option value="Finalizada">Finalizada</option>
          <option value="Pausada">Pausada</option>
        </select>

        {/* Botón de envío */}
        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Novela'}
        </button>
      </form>
    </div>
  );
};

export default NovelForm;