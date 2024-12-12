import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Card, Form, Container } from 'react-bootstrap';
import '../styles/StoryDetail.css'; // Importa el archivo CSS específico

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
                    const invalidIds = invalidCollaborators.map(col => col._id);

                    // Hacer solicitudes para obtener los datos de estos usuarios
                    const userPromises = invalidIds.map(id => axios.get(`/api/users/${id}`));

                    try {
                        const userResponses = await Promise.all(userPromises);
                        const usersData = userResponses.map(response => response.data);

                        // Actualizar los colaboradores con los datos obtenidos
                        const updatedCollaborators = storyData.collaborators.map(col => {
                            if (!col.user || !col.user.username) {
                                const fetchedUser = usersData.find(user => user.username === col.username);
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

    // Inicializar anuncios de AdSense cuando el componente se monta
    useEffect(() => {
        const initializeAds = () => {
            if (window.adsbygoogle) {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.error('Adsense error:', e);
                }
            }
        };
        // Usar un pequeño retraso para asegurarse de que los anuncios se carguen correctamente
        setTimeout(initializeAds, 1000);
    }, []);

    if (loading) return <p className="story-detail-loading">Cargando...</p>;
    if (error) return <p className="story-detail-error">{error}</p>;

    return (
        <div className="story-detail-container">
            {/* Espacio para Anuncio 1 */}
            <section className="ad-section my-4">
                <Container>
                    <div className="ad-section-container">
                        <ins className="adsbygoogle"
                             style={{ display: "block" }}
                             data-ad-client="ca-pub-3101266953328074"
                             data-ad-slot="2492564919"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                    </div>
                </Container>
            </section>

            <div className="row">
                <div className="col-md-4">
                    <Card className="shadow-sm story-detail-card">
                        <div className="story-detail-card-image-container">
                            <Card.Img
                                variant="top"
                                src={story.coverImage}
                                alt={`Portada de ${story.title}`}
                                className="story-detail-card-image"
                            />
                        </div>
                        <Card.Body>
                            <Button
                                className="btn btn-secondary mt-2 story-detail-read-btn"
                                onClick={() => handleReadChapter(story.chapters[0]?._id)}
                                disabled={!story.chapters.length}
                            >
                                Leer
                            </Button>
                            {/* Mostrar autor (usuario encargado) */}
                            <div className="mt-3 story-detail-author">
                                <strong>Usuario:</strong>{' '}
                                <Button variant="link" onClick={() => navigate(`/profileperson/${story.author}`)} className="story-detail-author-link">
                                    {story.author}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-8">
                    <Card className="shadow-sm story-detail-main-card">
                        <Card.Body>
                            <h3 className="story-detail-title">{story.title}</h3>
                            <div className="story-detail-info">
                                <strong>Clasificación:</strong>{' '}
                                <span className="badge bg-secondary story-detail-badge">{story.classification}</span>
                            </div>
                            <div className="story-detail-info">
                                <strong>Idioma de Origen:</strong> {story.languageOrigin}
                            </div>
                            <div className="story-detail-info">
                                <strong>Géneros:</strong> {story.genres.join(', ')}
                            </div>
                            <div className="story-detail-info">
                                <strong>Subgéneros:</strong>{' '}
                                {story.subGenres.length > 0
                                    ? story.subGenres.join(', ')
                                    : 'No especificado'}
                            </div>
                            <div className="story-detail-info">
                                <strong>Etiquetas:</strong>{' '}
                                {story.tags.length > 0 ? story.tags.join(', ') : 'Sin etiquetas'}
                            </div>
                            {/* Mostrar rawOrigin */}
                            <div className="mt-3 story-detail-raw-origin">
                                <strong>Novela Original:</strong>{' '}
                                {story.rawOrigin && story.rawOrigin.length > 0 ? (
                                    <a href={story.rawOrigin[0].link} target="_blank" rel="noopener noreferrer" className="story-detail-link">
                                        {story.rawOrigin[0].origin}
                                    </a>
                                ) : 'No disponible'}
                            </div>

                            <div className="mt-3 story-detail-collaborators">
                                <strong>Colaboradores:</strong>{' '}
                                {story.collaborators.length > 0 ? (
                                    story.collaborators.map((col, index) => (
                                        <div key={index} className="collaborator d-flex align-items-center mb-2">
                                            {/* Mostrar el nombre del colaborador como un enlace */}
                                            {col.username !== 'Usuario Desconocido' ? (
                                                <button
                                                    onClick={() => navigate(`/profileperson/${col.username}`)}
                                                    className="collaborator-link btn btn-link p-0 story-detail-collaborator-link"
                                                >
                                                    {col.username} ({col.role})
                                                </button>
                                            ) : (
                                                <span>{col.username} ({col.role})</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    'No hay colaboradores'
                                )}
                            </div>

                            {/* Mostrar adaptaciones */}
                            <div className="mt-3 story-detail-adaptations">
                                <strong>Adaptaciones:</strong>{' '}
                                {story.adaptations && story.adaptations.length > 0 ? (
                                    story.adaptations.map((adap, i) => (
                                        <span key={i} className="story-detail-adaptation">
                                            {adap.type} - {adap.title}: <a href={adap.link} target="_blank" rel="noopener noreferrer" className="story-detail-link">{adap.link}</a>
                                            {i < story.adaptations.length - 1 && ', '}
                                        </span>
                                    ))
                                ) : 'No hay adaptaciones'}
                            </div>

                            <div className="mt-3 story-detail-description">
                                <p>
                                    {story.description.length > 200
                                        ? `${story.description.substring(0, 200)}...`
                                        : story.description}
                                </p>
                                {story.description.length > 200 && (
                                    <Button
                                        variant="link"
                                        onClick={() => setShowModal(true)}
                                        className="p-0 story-detail-view-more-btn"
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
                <h4 className="story-detail-chapters-title">Capítulos</h4>
                {story.chapters.length ? (
                    story.chapters.map((chapter) => (
                        <Card
                            key={chapter._id}
                            className="shadow-sm mb-3 story-detail-chapter-card"
                            onClick={() => handleReadChapter(chapter._id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Body>
                                <h5 className="story-detail-chapter-title">{chapter.title}</h5>
                                <p className="story-detail-chapter-date">
                                    Publicado el {new Date(chapter.publishedAt).toLocaleDateString()}
                                </p>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p className="story-detail-no-chapters">No hay capítulos disponibles.</p>
                )}
            </div>

            {/* Espacio para Anuncio 2 */}
            <section className="ad-section my-4">
                <Container>
                    <div className="ad-section-container">
                        <ins className="adsbygoogle"
                             style={{ display: "block" }}
                             data-ad-client="ca-pub-3101266953328074"
                             data-ad-slot="3959158431"
                             data-ad-format="auto"
                             data-full-width-responsive="true"></ins>
                    </div>
                </Container>
            </section>

            <div className="mt-5">
                <h4 className="story-detail-comments-title">Comentarios</h4>
                <form onSubmit={handleReviewSubmit} className="mb-4 story-detail-review-form">
                    <div className="form-group mt-2">
                        <label htmlFor="review" className="story-detail-review-label">Deja un comentario</label>
                        <textarea
                            id="review"
                            className="form-control story-detail-review-textarea"
                            rows="3"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Escribe tu reseña aquí..."
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2 story-detail-submit-btn" disabled={!review}>
                        Enviar reseña
                    </button>
                </form>

                {story.reviews.length ? (
                    story.reviews.map((rev, idx) => (
                        <Card key={idx} className="shadow-sm mb-3 story-detail-review-card">
                            <Card.Body>
                                <div className="story-detail-review-user">
                                    <strong>{rev.user.username}</strong>
                                </div>
                                <p className="story-detail-review-comment">{rev.comment}</p>
                                <Button variant="link" onClick={() => setSelectedReview(rev)} className="story-detail-reply-btn">
                                    Responder
                                </Button>
                                {rev.replies?.map((reply, index) => (
                                    <Card key={index} className="mt-2 story-detail-reply-card">
                                        <Card.Body>
                                            <p className="story-detail-reply-text">{reply.text}</p>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p className="story-detail-no-reviews">No hay reseñas disponibles.</p>
                )}
            </div>

            {/* Modal Responder Reseña */}
            <Modal show={!!selectedReview} onHide={() => setSelectedReview(null)} centered className="story-detail-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Responder a {selectedReview?.user.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        className="form-control story-detail-reply-textarea"
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
                        className="story-detail-reply-submit-btn"
                    >
                        Responder
                    </Button>
                    <Button variant="secondary" onClick={() => setSelectedReview(null)} className="story-detail-reply-cancel-btn">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Descripción Completa */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="story-detail-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Descripción Completa</Modal.Title>
                </Modal.Header>
                <Modal.Body className="story-detail-modal-body">{story.description}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="story-detail-modal-close-btn">
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Contraseña (si idioma es coreano) */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered className="story-detail-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Esta novela está protegida por contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Para acceder a esta novela, ingresa la contraseña proporcionada.</p>
                    <Form.Group controlId="password">
                        <Form.Label className="story-detail-modal-label">Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa la contraseña"
                            value={enteredPassword}
                            onChange={(e) => setEnteredPassword(e.target.value)}
                            className="story-detail-modal-input"
                        />
                        {passwordError && (
                            <Form.Text className="text-danger story-detail-modal-error">
                                {passwordError}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePasswordSubmit} className="story-detail-modal-submit-btn">
                        Leer
                    </Button>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(false)} className="story-detail-modal-cancel-btn">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

};

export default StoryDetail;