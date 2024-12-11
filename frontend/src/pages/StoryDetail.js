// src/components/StoryDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Card, Form, Spinner } from 'react-bootstrap';
import { FaMagic } from 'react-icons/fa';

import '../styles/StoryDetail.css'; // Asegúrate de crear y personalizar este archivo

const StoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);
    const [review, setReview] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null); // Reseña seleccionada para responder
    const [reply, setReply] = useState(''); // Respuesta a la reseña

    // Modal para password si el idioma es Coreano
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [enteredPassword, setEnteredPassword] = useState('');
    const [chapterToRead, setChapterToRead] = useState(null);
    const [passwordError, setPasswordError] = useState(''); // Para mostrar errores de contraseña

    // Estado para manejar la autorización de capítulos
    const [authorizedChapters, setAuthorizedChapters] = useState({});

    // Estado y efecto para el usuario actual
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get("/api/users/profile", { withCredentials: true });
                if (response.data) {
                    setCurrentUser(response.data);
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                setUserError("Error al obtener los datos del usuario.");
                setCurrentUser(null);
            } finally {
                setUserLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await axios.get(`/api/novels/${id}`);
                const storyData = res.data;

                // Verificar si los colaboradores están correctamente poblados
                if (!storyData.collaborators || !Array.isArray(storyData.collaborators)) {
                    throw new Error('Datos de colaboradores inválidos.');
                }

                // Identificar colaboradores con 'Usuario Desconocido'
                const invalidCollaborators = storyData.collaborators.filter(col => !col.user || !col.user.username);

                if (invalidCollaborators.length > 0) {
                    // Obtener los IDs de los colaboradores inválidos
                    const invalidIds = invalidCollaborators.map(col => col.user); // Asegúrate de que 'user' contenga el ID

                    // Hacer solicitudes para obtener los datos de estos usuarios
                    const userPromises = invalidIds.map(id => axios.get(`/api/users/${id}`));

                    try {
                        const userResponses = await Promise.all(userPromises);
                        const usersData = userResponses.map(response => response.data);

                        // Actualizar los colaboradores con los datos obtenidos
                        const updatedCollaborators = storyData.collaborators.map(col => {
                            if (!col.user || !col.user.username) {
                                const fetchedUser = usersData.find(user => user._id === col.user);
                                if (fetchedUser) {
                                    return {
                                        ...col,
                                        user: fetchedUser,
                                    };
                                }
                            }
                            return col;
                        });

                        setStory({ ...storyData, collaborators: updatedCollaborators });
                    } catch (err) {
                        console.error('Error al obtener datos de colaboradores inválidos:', err);
                        // Opcional: manejar errores específicos
                    }
                } else {
                    setStory(storyData);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error al cargar la historia:', err);
                setError('Error al cargar la historia.');
                setLoading(false);
            }
        };
        fetchStory();
    }, [id]);

    const handleSaveStory = async () => {
        try {
            await axios.post(`/api/novels/${id}/follow`, {}, {
                withCredentials: true,
            });
            setSaved(true);
            alert('Historia guardada en tu biblioteca.');
        } catch (err) {
            alert('Error al guardar la historia.');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/novels/${id}/reviews`,
                {
                    comment: review
                },
                { withCredentials: true });

            alert('Reseña enviada exitosamente.');
            setReview('');
        } catch (err) {
            alert('Error al enviar la reseña.');
        }
    };


    const handleReplySubmit = async (e, reviewId) => {
        e.preventDefault();
        try {
            await axios.post(`/api/novels/${id}/reviews/${reviewId}/reply`, {
                text: reply,
            }, { withCredentials: true });
            alert('Respuesta enviada.');
            setReply('');
            setSelectedReview(null);
        } catch (err) {
            alert('Error al enviar la respuesta.');
        }
    };

    const handleReadChapter = (chapterId) => {
        // Si el idioma es Coreano, pedir password antes de leer
        if (story.languageOrigin === 'Coreano') {
            // Verificar si el capítulo ya está autorizado
            if (authorizedChapters[chapterId]) {
                navigate(`/read-chapter/${id}/${chapterId}`);
            } else {
                setChapterToRead(chapterId);
                setShowPasswordModal(true);
            }
        } else {
            navigate(`/read-chapter/${id}/${chapterId}`);
        }
    };

    const handlePasswordSubmit = async () => {
        if (!enteredPassword.trim()) {
            setPasswordError('Por favor, ingresa una contraseña.');
            return;
        }

        try {
            const res = await axios.post(`/api/novels/${id}/verify-password`, {
                password: enteredPassword
            }, { withCredentials: true });

            if (res.data.authorized) {
                // Autorizar el acceso al capítulo
                setAuthorizedChapters(prev => ({ ...prev, [chapterToRead]: true }));
                setShowPasswordModal(false);
                setEnteredPassword('');
                setPasswordError('');
                navigate(`/read-chapter/${id}/${chapterToRead}`);
            } else {
                setPasswordError('Contraseña incorrecta.');
            }
        } catch (err) {
            console.error(err);
            setPasswordError('Error al verificar la contraseña.');
        }
    };

    // Estado y Modal para agregar un capítulo
    const [showAddChapterModal, setShowAddChapterModal] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const [newChapterContent, setNewChapterContent] = useState('');
    const [addChapterError, setAddChapterError] = useState('');

    const handleAddChapterSubmit = async (e) => {
        e.preventDefault();
        if (!newChapterTitle.trim() || !newChapterContent.trim()) {
            setAddChapterError('Por favor, completa todos los campos.');
            return;
        }

        try {
            const res = await axios.post(`/api/novels/${id}/chapters`, {
                title: newChapterTitle,
                content: newChapterContent
            }, { withCredentials: true });

            // Actualizar la lista de capítulos en el estado
            setStory(prevStory => ({
                ...prevStory,
                chapters: [...prevStory.chapters, res.data.chapter]
            }));

            alert('Capítulo agregado exitosamente.');
            setShowAddChapterModal(false);
            setNewChapterTitle('');
            setNewChapterContent('');
            setAddChapterError('');
        } catch (err) {
            console.error(err);
            setAddChapterError('Error al agregar el capítulo.');
        }
    };

    if (loading || userLoading) return <p className="loading-text">Cargando...</p>;
    if (error) return <p className="error-text">{error}</p>;
    if (userError) return <p className="error-text">{userError}</p>;
    if (!story) return <p className="error-text">Historia no encontrada.</p>;

    return (
        <div className="story-detail-container">
            <div className="row">
                <div className="col-md-4">
                    <Card className="story-cover-card shadow-sm">
                        <Card.Img
                            variant="top"
                            src={story.coverImage}
                            alt={`Portada de ${story.title}`}
                            className="story-cover-image"
                        />
                        <Card.Body className="d-flex flex-column align-items-center">
                            <Button
                                className="btn btn-secondary mt-2 fantasy-button"
                                onClick={() => handleReadChapter(story.chapters[0]?._id)}
                                disabled={!story.chapters.length}
                            >
                                Leer
                            </Button>
                            {/* Mostrar autor (usuario encargado) */}
                            <div className="mt-3 author-info">
                                <strong>Autor:</strong>{' '}
                                <Button variant="link" onClick={() => navigate(`/profileperson/${story.author?.username}`)} className="author-link fantasy-link">
                                    {story.author?.username || 'Autor desconocido'}
                                </Button>
                            </div>
                            {/* Botón para agregar capítulo si el usuario es el autor */}
                            {currentUser && currentUser.username === story.author?.username && (
                                <Button
                                    variant="success"
                                    className="btn mt-2 fantasy-button"
                                    onClick={() => navigate(`/add-chapter/${id}`)}
                                >
                                    Agregar Capítulo
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-8">
                    <Card className="story-info-card shadow-sm">
                        <Card.Body>
                            <h3 className="story-title"><FaMagic /> {story.title}</h3>
                            <div className="story-details">
                                <strong>Clasificación:</strong>{' '}
                                <span className="badge classification-badge">{story.classification}</span>
                            </div>
                            <div className="story-details">
                                <strong>Idioma de Origen:</strong> {story.languageOrigin}
                            </div>
                            <div className="story-details">
                                <strong>Géneros:</strong> {story.genres.join(', ')}
                            </div>
                            <div className="story-details">
                                <strong>Subgéneros:</strong>{' '}
                                {story.subGenres.length > 0
                                    ? story.subGenres.join(', ')
                                    : 'No especificado'}
                            </div>
                            <div className="story-details">
                                <strong>Etiquetas:</strong>{' '}
                                {story.tags.length > 0 ? story.tags.join(', ') : 'Sin etiquetas'}
                            </div>
                            {/* Mostrar rawOrigin */}
                            <div className="story-details mt-3">
                                <strong>Novela Original:</strong>{' '}
                                {story.rawOrigin && story.rawOrigin.length > 0 ? (
                                    <a href={story.rawOrigin[0].link} target="_blank" rel="noopener noreferrer" className="original-link fantasy-link">
                                        {story.rawOrigin[0].origin}
                                    </a>
                                ) : 'No disponible'}
                            </div>

                            <div className="story-details mt-3">
                                <strong>Colaboradores:</strong>{' '}
                                {story.collaborators.length > 0 ? (
                                    <div className="collaborators-list">
                                        {story.collaborators.map((col, index) => (
                                            <div key={index} className="collaborator d-flex align-items-center mb-2">
                                                {/* Mostrar el nombre del colaborador como un enlace */}
                                                {col.user?.username !== 'Usuario Desconocido' ? (
                                                    <button
                                                        onClick={() => navigate(`/profileperson/${col.user.username}`)}
                                                        className="collaborator-link btn btn-link p-0 fantasy-link"
                                                    >
                                                        {col.user.username} ({col.role})
                                                    </button>
                                                ) : (
                                                    <span>{col.user?.username || 'Usuario Desconocido'} ({col.role})</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    'No hay colaboradores'
                                )}
                            </div>

                            {/* Mostrar adaptaciones */}
                            <div className="story-details mt-3">
                                <strong>Adaptaciones:</strong>{' '}
                                {story.adaptations && story.adaptations.length > 0 ? (
                                    story.adaptations.map((adap, i) => (
                                        <span key={i} className="adaptation-item">
                                            {adap.type} - {adap.title}: <a href={adap.link} target="_blank" rel="noopener noreferrer" className="adaptation-link fantasy-link">{adap.link}</a>
                                            {i < story.adaptations.length - 1 && ', '}
                                        </span>
                                    ))
                                ) : 'No hay adaptaciones'}
                            </div>

                            <div className="story-description mt-3">
                                <p className="short-description">
                                    {story.description.length > 200
                                        ? `${story.description.substring(0, 200)}...`
                                        : story.description}
                                </p>
                                {story.description.length > 200 && (
                                    <Button
                                        variant="link"
                                        onClick={() => setShowModal(true)}
                                        className="read-more-link fantasy-link p-0"
                                    >
                                        Ver más
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <div className="mt-5">
                <h4 className="section-title">Capítulos</h4>
                {story.chapters.length ? (
                    story.chapters.map((chapter) => (
                        <Card
                            key={chapter._id}
                            className="chapter-card shadow-sm mb-3 fantasy-card"
                            onClick={() => handleReadChapter(chapter._id)}
                        >
                            <Card.Body>
                                <h5 className="chapter-title">{chapter.title}</h5>
                                <p className="chapter-date">
                                    Publicado el {new Date(chapter.publishedAt).toLocaleDateString()}
                                </p>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>No hay capítulos disponibles.</p>
                )}
            </div>

            <div className="mt-5">
                <h4 className="section-title">Comentarios</h4>
                <form onSubmit={handleReviewSubmit} className="mb-4">
                    <div className="form-group mt-2">
                        <label htmlFor="review" className="review-label fantasy-label">Deja un comentario</label>
                        <textarea
                            id="review"
                            className="form-control fantasy-input review-textarea"
                            rows="3"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Escribe tu reseña aquí..."
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2 fantasy-button" disabled={!review}>
                        Enviar reseña
                    </button>
                </form>

                {story.reviews.length ? (
                    story.reviews.map((rev, idx) => (
                        <Card key={idx} className="shadow-sm mb-3 fantasy-card">
                            <Card.Body>
                                <div className="review-header">
                                    <strong>{rev.user?.username || 'Usuario desconocido'}</strong>
                                </div>
                                <p className="review-comment">{rev.comment}</p>
                                <Button variant="link" onClick={() => setSelectedReview(rev)} className="fantasy-link p-0">
                                    Responder
                                </Button>
                                {rev.replies?.map((reply, index) => (
                                    <Card key={index} className="mt-2 reply-card fantasy-card">
                                        <Card.Body>
                                            <p className="reply-text">{reply.text}</p>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>No hay reseñas disponibles.</p>
                )}
            </div>

            {/* Modal Responder Reseña */}
            <Modal show={!!selectedReview} onHide={() => setSelectedReview(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Responder a {selectedReview?.user?.username || 'Usuario desconocido'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        className="form-control fantasy-input"
                        rows="3"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={(e) => handleReplySubmit(e, selectedReview?._id)}
                        disabled={!reply.trim()}
                        className="fantasy-button"
                    >
                        Responder
                    </Button>
                    <Button variant="secondary" onClick={() => setSelectedReview(null)} className="fantasy-button">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Descripción Completa */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Descripción Completa</Modal.Title>
                </Modal.Header>
                <Modal.Body>{story.description}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="fantasy-button">
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Contraseña (si idioma es coreano) */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Esta novela está protegida por contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Para acceder a esta novela, ingresa la contraseña proporcionada.</p>
                    <Form.Group controlId="password">
                        <Form.Label className="fantasy-label">Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa la contraseña"
                            value={enteredPassword}
                            onChange={(e) => setEnteredPassword(e.target.value)}
                            className="fantasy-input"
                        />
                        {passwordError && (
                            <Form.Text className="text-danger">
                                {passwordError}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePasswordSubmit} className="fantasy-button">
                        Leer
                    </Button>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(false)} className="fantasy-button">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

};

export default StoryDetail;