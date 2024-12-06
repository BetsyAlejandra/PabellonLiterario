import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import '../styles/global.css';

const LANGUAGES = ['Japonés', 'Chino', 'Coreano', 'Inglés'];
const ROLES = ['Traductor', 'Editor', 'Ilustrador', 'Corrector'];
const ADAPTATION_TYPES = [
    'Audio-Drama', 'Manhua', 'Manwha', 'Manga', 'K-Drama', 'Dorama',
    'Película', 'Donghua', 'Anime', 'Videojuego',
];

const UpdateNovel = () => {
    const { id } = useParams(); // ID de la novela para editar
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
    const [languageOrigin, setLanguageOrigin] = useState('');
    const [password, setPassword] = useState('');
    const [rawOrigin, setRawOrigin] = useState({ origin: '', link: '' });

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('success');

    // Manejo de colaboradores
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

    // Manejo de adaptaciones
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

    // Manejo de premios
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

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('/api/novels/genres');
                setGenres(response.data);
            } catch (error) {
                console.error('Error al obtener los géneros:', error.message);
            }
        };

        const fetchNovelDetails = async () => {
            try {
                const response = await axios.get(`/api/novels/${id}`);
                const novel = response.data;

                setTitle(novel.title);
                setDescription(novel.description);
                setSelectedGenre(novel.genres[0] || '');
                setSubGenres(novel.subGenres ? novel.subGenres.join(', ') : '');
                setClassification(novel.classification || '');
                setTags(novel.tags ? novel.tags.join(', ') : '');
                setCollaborators(novel.collaborators || [{ name: '', role: '' }]);
                setAdaptations(novel.adaptations || [{ type: '', title: '', releaseDate: '', link: '' }]);
                setAwards(novel.awards || [{ title: '', year: '', organization: '' }]);
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

        fetchGenres();
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
        const subGenresArray = subGenres ? subGenres.split(',').map((s) => s.trim()).filter(Boolean) : [];
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
        formData.append('awards', JSON.stringify(awards));
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
                        <h2 className="text-center mb-4">Editar Novela</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="title">Título (Obligatorio):</label>
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
                                <label htmlFor="description">Sinopsis (Obligatorio):</label>
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
                                <label>Idioma de Origen (Obligatorio):</label>
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
                                    <label>Contraseña (Obligatorio si Coreano):</label>
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
                                <label htmlFor="genres">Género (Obligatorio):</label>
                                <select
                                    id="genres"
                                    className="form-control"
                                    value={selectedGenre}
                                    onChange={(e) => setSelectedGenre(e.target.value)}
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

                            <div className="form-group mb-3">
                                <label htmlFor="subGenres">Subgéneros (opcional, máximo 15):</label>
                                <input
                                    type="text"
                                    id="subGenres"
                                    className="form-control custom-input"
                                    value={subGenres}
                                    onChange={(e) => setSubGenres(e.target.value)}
                                    placeholder="Subgéneros separados por coma"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="classification">Clasificación (Obligatorio):</label>
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
                                <label htmlFor="tags">Etiquetas (opcional, separadas por comas):</label>
                                <input
                                    type="text"
                                    id="tags"
                                    className="form-control custom-input"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="Ejemplo: Aventura, magia, amor"
                                />
                            </div>

                            {/* Origen de la novela (Obligatorio) */}
                            <div className="form-group mb-3">
                                <label>Nombre de la novela original (Obligatorio):</label>
                                <input
                                    type="text"
                                    className="form-control custom-input"
                                    value={rawOrigin.origin}
                                    onChange={(e) => setRawOrigin((prev) => ({ ...prev, origin: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Enlace a la novela original (Obligatorio):</label>
                                <input
                                    type="url"
                                    className="form-control custom-input"
                                    value={rawOrigin.link}
                                    onChange={(e) => setRawOrigin((prev) => ({ ...prev, link: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Colaboradores (opcional):</label>
                                {collaborators.map((collaborator, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Nombre"
                                            value={collaborator.name}
                                            onChange={(e) => handleCollaboratorChange(index, e)}
                                            className="form-control custom-input my-1"
                                        />
                                        <input
                                            type="text"
                                            name="role"
                                            placeholder="Rol"
                                            value={collaborator.role}
                                            onChange={(e) => handleCollaboratorChange(index, e)}
                                            className="form-control custom-input my-1"
                                        />
                                        <button type="button" className="remove-button" onClick={() => removeCollaborator(index)}>Eliminar</button>
                                    </div>
                                ))}
                                <button type="button" className="add-button" onClick={addCollaborator}>Añadir Colaborador</button>
                            </div>

                            <div className="form-group mb-3">
                                <label>Adaptaciones (opcional):</label>
                                {adaptations.map((adaptation, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            name="type"
                                            placeholder="Tipo (ej. Película)"
                                            value={adaptation.type}
                                            onChange={(e) => handleAdaptationChange(index, e)}
                                            className="form-control custom-input my-1"
                                        />
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Título"
                                            value={adaptation.title}
                                            onChange={(e) => handleAdaptationChange(index, e)}
                                            className="form-control custom-input my-1"
                                        />
                                        <input
                                            type="text"
                                            name="releaseDate"
                                            placeholder="Fecha de Lanzamiento"
                                            value={adaptation.releaseDate}
                                            onChange={(e) => handleAdaptationChange(index, e)}
                                            className="form-control custom-input my-1"
                                        />
                                        <input
                                            type="url"
                                            name="link"
                                            placeholder="Enlace"
                                            value={adaptation.link}
                                            onChange={(e) => handleAdaptationChange(index, e)}
                                            className="form-control custom-input my-1"
                                        />
                                        <button type="button" className="remove-button" onClick={() => removeAdaptation(index)}>Eliminar</button>
                                    </div>
                                ))}
                                <button type="button" className="add-button" onClick={addAdaptation}>Añadir Adaptación</button>
                            </div>

                            <div className="form-group mb-3">
                                <label>Premios (opcional):</label>
                                {awards.map((award, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            name="title"
                                            placeholder="Título del premio"
                                            value={award.title}
                                            onChange={(e) => handleAwardChange(index, e)}
                                            className="form-control custom-input my-1"
                                        />
                                        <input
                                            type="text"
                                            name="year"
                                            placeholder="Año"
                                            value={award.year}
                                            onChange={(e) => handleAwardChange(index, e)}
                                            className="form-control custom-input my-1"
                                        />
                                        <input
                                            type="text"
                                            name="organization"
                                            placeholder="Organización"
                                            value={award.organization}
                                            onChange={(e) => handleAwardChange(index, e)}
                                            className="form-control custom-input my-1"
                                        />
                                        <button type="button" className="remove-button" onClick={() => removeAward(index)}>Eliminar</button>
                                    </div>
                                ))}
                                <button type="button" className="add-button" onClick={addAward}>Añadir Premio</button>
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="progress">Estado de progreso (Obligatorio):</label>
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