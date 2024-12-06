import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Card, Form } from 'react-bootstrap';
import '../styles/global.css';

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

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await axios.get(`/api/novels/${id}`);
                setStory(res.data);
                setLoading(false);
            } catch (err) {
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
            });
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
            setChapterToRead(chapterId);
            setShowPasswordModal(true);
        } else {
            navigate(`/read-chapter/${id}/${chapterId}`);
        }
    };

    const handlePasswordSubmit = async () => {
        // Aquí podrías verificar la contraseña antes de permitir leer.
        // Asumamos que la contraseña correcta es la almacenada en story.password (si existe)
        // De no tener la contraseña en story, ajusta la lógica según tu API.
        if (enteredPassword.trim() === story.password) {
            setShowPasswordModal(false);
            setEnteredPassword('');
            navigate(`/read-chapter/${id}/${chapterToRead}`);
        } else {
            alert('Contraseña incorrecta.');
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-4">
                    <Card className="shadow-sm">
                        <Card.Img
                            variant="top"
                            src={story.coverImage}
                            alt={`Portada de ${story.title}`}
                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                            <Button
                                className="btn btn-secondary mt-2"
                                onClick={() => handleReadChapter(story.chapters[0]?._id)}
                                disabled={!story.chapters.length}
                            >
                                Leer
                            </Button>
                            {/* Mostrar autor (usuario encargado) */}
                            <div className="mt-3">
                                <strong>Autor:</strong>{' '}
                                <Button variant="link" onClick={() => navigate(`/profileperson/${story.author}`)}>
                                    {story.author}
                                </Button>

                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-8">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h3>{story.title}</h3>
                            <div>
                                <strong>Clasificación:</strong>{' '}
                                <span className="badge bg-secondary">{story.classification}</span>
                            </div>
                            <div>
                                <strong>Idioma de Origen:</strong> {story.languageOrigin}
                            </div>
                            <div>
                                <strong>Géneros:</strong> {story.genres.join(', ')}
                            </div>
                            <div>
                                <strong>Subgéneros:</strong>{' '}
                                {story.subGenres.length > 0
                                    ? story.subGenres.join(', ')
                                    : 'No especificado'}
                            </div>
                            <div>
                                <strong>Etiquetas:</strong>{' '}
                                {story.tags.length > 0 ? story.tags.join(', ') : 'Sin etiquetas'}
                            </div>
                            {/* Mostrar rawOrigin */}
                            <div className="mt-3">
                                <strong>Novela Original:</strong>{' '}
                                {story.rawOrigin && story.rawOrigin.length > 0 ? (
                                    <a href={story.rawOrigin[1].link} target="_blank" rel="noopener noreferrer">
                                        {story.rawOrigin[1].origin}
                                    </a>
                                ) : 'No disponible'}

                            </div>

                            {/* Mostrar colaboradores con link a profileperson */}
                            <div className="mt-3">
                                <strong>Colaboradores:</strong>{' '}
                                {story.collaborators && story.collaborators.length > 0 ? (
                                    story.collaborators.map((col, i) => (
                                        <span key={i}>
                                            <Button
                                                variant="link"
                                                onClick={() => navigate(`/profileperson/${col.name}`)}
                                            >
                                                {col.name} ({col.role})
                                            </Button>
                                            {i < story.collaborators.length - 1 && ', '}
                                        </span>
                                    ))
                                ) : 'No hay colaboradores'}

                            </div>

                            {/* Mostrar adaptaciones */}
                            <div className="mt-3">
                                <strong>Adaptaciones:</strong>{' '}
                                {story.adaptations && story.adaptations.length > 0 ? (
                                    story.adaptations.map((adap, i) => (
                                        <span key={i}>
                                            {adap.type} - {adap.title}: <a href={adap.link} target="_blank" rel="noopener noreferrer">{adap.link}</a>
                                            {i < story.adaptations.length - 1 && ', '}
                                        </span>
                                    ))
                                ) : 'No hay adaptaciones'}

                            </div>

                            <div className="mt-3">
                                <p>
                                    {story.description.length > 200
                                        ? `${story.description.substring(0, 200)}...`
                                        : story.description}
                                </p>
                                {story.description.length > 200 && (
                                    <Button
                                        variant="link"
                                        onClick={() => setShowModal(true)}
                                        className="p-0"
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
                <h4>Capítulos</h4>
                {story.chapters.length ? (
                    story.chapters.map((chapter) => (
                        <Card
                            key={chapter._id}
                            className="shadow-sm mb-3"
                            onClick={() => handleReadChapter(chapter._id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Body>
                                <h5>{chapter.title}</h5>
                                <p>
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
                <h4>Comentarios</h4>
                <form onSubmit={handleReviewSubmit} className="mb-4">
                    <div className="form-group mt-2">
                        <label htmlFor="review">Deja un comentario</label>
                        <textarea
                            id="review"
                            className="form-control"
                            rows="3"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Escribe tu reseña aquí..."
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2" disabled={!review}>
                        Enviar reseña
                    </button>
                </form>

                {story.reviews.length ? (
                    story.reviews.map((rev, idx) => (
                        <Card key={idx} className="shadow-sm mb-3">
                            <Card.Body>
                                <div>
                                    <strong>{rev.user.username}</strong>
                                </div>
                                <p>{rev.comment}</p>
                                <Button variant="link" onClick={() => setSelectedReview(rev)}>
                                    Responder
                                </Button>
                                {rev.replies?.map((reply, index) => (
                                    <Card key={index} className="mt-2">
                                        <Card.Body>
                                            <p>{reply.text}</p>
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
                    <Modal.Title>Responder a {selectedReview?.user.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        className="form-control"
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
                    >
                        Responder
                    </Button>
                    <Button variant="secondary" onClick={() => setSelectedReview(null)}>
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Contraseña (si idioma es coreano) */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Esta novela esta protegida por contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Para adquirir la contraseña de la novela, buscala en el discord de Pabellón Literario.</p>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePasswordSubmit}>
                        Leer
                    </Button>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StoryDetail;