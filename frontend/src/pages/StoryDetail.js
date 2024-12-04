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
            const res = await axios.post(`/api/novels/${id}/follow`, {}, {
            withCredentials: true, // Asegura que las cookies se envíen
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
        navigate(`/read-chapter/${id}/${chapterId}`);
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
                        <label htmlFor="review">Deja una comentario</label>
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
                                    <strong>{rev.user.username}</strong> -{' '}
                                    {[...Array(rev.rating)].map((_, i) => (
                                        <span key={i}>★★★★★</span>
                                    ))}
                                </div>
                                <p>{rev.comment}</p>
                                <Button
                                    variant="link"
                                    onClick={() => setSelectedReview(rev)}
                                >
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
        </div>
    );
};

export default StoryDetail;