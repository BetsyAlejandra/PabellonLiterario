import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
    'Formaciones Mágicas', 'Feng Shui', 'Relaciones No-Humanas', 'Toque Cómico', '',
    'Viaje en el Tiempo','Transmigración','Mitología','Venganza','Tsundere','Shounen Ai',
    'Época Moderna','Reencarnación','Protagonista Desinteresado','Inmortales','Oscuro',  
    'Demonios','Demoniaco','Diablos','Gore','Multiples Identidades','Pareja Poderosa',
    'Romance lento','Detectives','Espias','Pasado Traumatico',
];

const ADAPTATION_TYPES = [
    'Audio-Drama', 'Manhua', 'Manwha', 'Manga', 'K-Drama', 'Dorama',
    'Película', 'Donghua', 'Anime', 'Videojuego',
];

const LANGUAGES = ['Japonés', 'Chino', 'Coreano', 'Inglés'];
const ROLES = ['Traductor', 'Editor', 'Ilustrador', 'Corrector'];

const UpdateNovel = () => {
    const { id } = useParams(); // ID de la novela para editar
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
    const [userSuggestions, setUserSuggestions] = useState(null);
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

    const closeSubGenreModal = () => {
        setShowSubGenreModal(false);
    };

    const handleCollaboratorChange = async (index, key, value) => {
        const updatedCollaborators = [...collaborators];
        updatedCollaborators[index][key] = value;

        if (key === 'username' && value.length > 2) {
            try {
                const { data } = await axios.get(`/api/users/suggestions?name=${value}`);
                setUserSuggestions(data); // data es un objeto o null
            } catch (error) {
                console.error(error);
                setUserSuggestions(null);
            }
        }

        setCollaborators(updatedCollaborators);
    };

    const removeCollaborator = (index) => {
        const updated = [...collaborators];
        updated.splice(index, 1);
        setCollaborators(updated);
    };

    const removeAdaptation = (index) => {
        const updated = [...adaptations];
        updated.splice(index, 1);
        setAdaptations(updated);
    };

    useEffect(() => {
        const fetchNovelDetails = async () => {
            try {
                const response = await axios.get(`/api/novels/${id}`);
                const novel = response.data;

                setTitle(novel.title);
                setDescription(novel.description);
                setSelectedGenre(novel.genres[0] || '');
                setSubGenres(novel.subGenres || []);
                setClassification(novel.classification || '');
                setTags(novel.tags ? novel.tags.join(', ') : '');
                setCollaborators(novel.collaborators || [{ name: '', role: '' }]);
                setAdaptations(novel.adaptations || [{ type: '', title: '', releaseDate: '', link: '' }]);
                setProgress(novel.progress || 'En progreso');
                setLanguageOrigin(novel.languageOrigin || '');

                // rawOrigin es un objeto con origin y link, si no existe, se pone vacío
                setRawOrigin(novel.rawOrigin || { origin: '', link: '' });

                // Si hay password, se muestra solo si es Coreano, de lo contrario vacío
                setPassword(novel.languageOrigin === 'Coreano' ? novel.password || '' : '');

                // Usa la URL pública de la imagen almacenada
                if (novel.coverImage) {
                    setPreviewImage(novel.coverImage);
                }
            } catch (error) {
                console.error('Error al cargar la novela:', error.message);
            }
        };
        fetchNovelDetails();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones similares a la creación
        if (!title || !description || !selectedGenre || !classification || !languageOrigin || !rawOrigin.origin || !rawOrigin.link) {
            setModalMessage('Por favor, completa todos los campos obligatorios (Título, Sinopsis, Género, Clasificación, Idioma, Origen de la novela).');
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

        // Validar subgéneros
        const subGenresArray = subGenres; // ahora subGenres es array
        if (subGenresArray.length > 15) {
            setModalMessage('Solo puedes seleccionar hasta 15 subgéneros.');
            setModalType('error');
            setShowModal(true);
            return;
        }
        


        // Validar colaboradores si son obligatorios (en el create eran obligatorios solo si se llenaba algo)
        // En el ultimo requerimiento se dejaron colaboradores opcionales, no es obligatorio validarlos.
        // Si quisieras validarlos solo si se agregan:
        // if (collaborators.some(c => c.name.trim() || c.role.trim())) { ...validación... }
        // Por ahora, no se exige colaborador obligatorio.

        const tagsArray = tags ? tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('genres', selectedGenre);
        formData.append('subGenres', JSON.stringify(subGenresArray));
        formData.append('classification', classification);
        formData.append('tags', JSON.stringify(tagsArray));
        formData.append('collaborators', JSON.stringify(collaborators));
        formData.append('adaptations', JSON.stringify(adaptations));
        formData.append('progress', progress);
        formData.append('languageOrigin', languageOrigin);
        formData.append('password', password);
        formData.append('rawOrigin', JSON.stringify(rawOrigin));

        // Si se seleccionó una nueva portada, se envía
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }

        try {
            setLoading(true);
            await axios.put(`/api/novels/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setModalMessage('¡Novela actualizada exitosamente!');
            setModalType('success');
            setShowModal(true);

            setTimeout(() => {
                navigate('/my-stories');
            }, 2000);
        } catch (error) {
            setModalMessage(`Error al actualizar la novela: ${error.response?.data.message || error.message}`);
            setModalType('error');
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file.size > 5 * 1024 * 1024) {
            setModalMessage('El archivo seleccionado supera el tamaño máximo permitido de 5MB.');
            setModalType('error');
            setShowModal(true);
        } else {
            setCoverImage(file);
            setPreviewImage(URL.createObjectURL(file)); // Muestra la imagen seleccionada
        }
    }


    const toggleSubGenre = (subGenre) => {
        if (subGenres.includes(subGenre)) {
            setSubGenres(subGenres.filter((sg) => sg !== subGenre));
        } else if (subGenres.length < 15) {
            setSubGenres([...subGenres, subGenre]);
        }
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    return (
        <div className="container my-5">
            {/* Modal */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                className={modalType === 'success' ? 'modal-success' : 'modal-error'}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'success' ? '¡Éxito!' : 'Error'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant={modalType === 'success' ? 'success' : 'danger'}
                        onClick={handleCloseModal}
                    >
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
                    <Button variant="primary" onClick={closeSubGenreModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            <div className="row">
                <div className="col-md-8">
                    <div className="novel-form-card">
                        <h2 className="text-center mb-4">Editar Novela</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="title">Título</label>
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

                            <div className="form-group mb-3">
                                <label htmlFor="description">Sinopsis</label>
                                <textarea
                                    id="description"
                                    className="form-control custom-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    placeholder="Escribe una breve sinopsis de tu novela"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Idioma de Origen</label>
                                <select
                                    className="form-control"
                                    value={languageOrigin}
                                    onChange={(e) => setLanguageOrigin(e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona un idioma</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {languageOrigin === 'Coreano' && (
                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group mb-3">
                                <label htmlFor="genres">Género</label>
                                <select
                                    id="genres"
                                    className="form-control"
                                    value={selectedGenre}
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona un género</option>
                                    {GENRES.map((genre) => (
                                        <option key={genre} value={genre}>
                                            {genre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="subGenres">Subgéneros</label>
                                <Button variant="outline-light" onClick={() => setShowSubGenreModal(true)}>
                                    Seleccionar Subgéneros
                                </Button>
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="classification">Clasificación</label>
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

                            <div className="form-group mb-3">
                                <label htmlFor="tags">Etiquetas</label>
                                <input
                                    type="text"
                                    id="tags"
                                    className="form-control custom-input"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="Ejemplo: Aventura, magia, amor"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Enlace a la Novela de Origen</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={rawOrigin.origin}
                                    onChange={(e) => setRawOrigin((prev) => ({ ...prev, origin: e.target.value }))}
                                    placeholder="Nombre de la novela original"
                                />
                                <input
                                    type="url"
                                    className="form-control"
                                    value={rawOrigin.link}
                                    onChange={(e) => setRawOrigin((prev) => ({ ...prev, link: e.target.value }))}
                                    placeholder="Enlace a la novela original"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Colaboradores</label>
                                {collaborators.map((collaborator, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            placeholder="Usuario"
                                            list={`user-suggestions-${index}`}
                                            className="form-control"
                                            value={collaborator.username}
                                            onChange={(e) => handleCollaboratorChange(index, 'username', e.target.value)}
                                        />
                                        <datalist id={`user-suggestions-${index}`}>
                                            {userSuggestions && (
                                                <option value={userSuggestions.username} />
                                            )}
                                        </datalist>

                                        <select
                                            className="form-control"
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

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeCollaborator(index)}
                                        >
                                            Eliminar colaborador
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={() => setCollaborators([...collaborators, { username: '', role: '' }])}
                                >
                                    Añadir Colaborador
                                </button>
                            </div>

                            <div className="form-group mb-3">
                                <label>Adaptaciones</label>
                                {adaptations.map((adaptation, index) => (
                                    <div key={index}>
                                        <select
                                            className="form-control"
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
                                            className="form-control"
                                            value={adaptation.link}
                                            onChange={(e) =>
                                                setAdaptations((prev) =>
                                                    prev.map((ad, i) => (i === index ? { ...ad, link: e.target.value } : ad))
                                                )
                                            }
                                            placeholder="Enlace (opcional)"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeAdaptation(index)}
                                        >
                                            Eliminar Adaptación
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="add-button"
                                    onClick={() => setAdaptations([...adaptations, { type: '', link: '' }])}
                                >
                                    Añadir Adaptación
                                </button>
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="progress">Estado de progreso</label>
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

                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/my-stories')}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="novel-preview">
                        <h5>Vista Previa de la Portada</h5>
                        <div className="mb-3">
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
                            className="form-control-file mb-4 custom-file-input"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateNovel;