import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import '../styles/global.css';

const MyStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null); // Historia seleccionada para mostrar capítulos
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/novels/my-stories', {
                    withCredentials: true, // Envía cookies o tokens de sesión
                });
                setStories(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error al cargar las historias.');
                setLoading(false);
            }
        };
        fetchUserStories();
    }, []);

    const handleEditClick = (id) => {
        navigate(`/update/${id}`);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta historia?')) {
            try {
                await axios.delete(`http://localhost:5000/api/novels/${id}`);
                setStories((prevStories) => prevStories.filter((story) => story._id !== id));
                alert('Historia eliminada exitosamente.');
            } catch (err) {
                alert('Error al eliminar la historia. Intenta nuevamente.');
                console.error(err);
            }
        }
    };

    const handleAddChapter = (id) => {
        navigate(`/add-chapter/${id}`);
    };

    const handleViewChapters = (story) => {
        setSelectedStory(story); // Establece la historia seleccionada
        setModalShow(true); // Muestra el modal
    };

    const handleEditChapter = (storyId, chapterId) => {
        navigate(`/edit-chapter/${storyId}/${chapterId}`); // Redirige a la página de edición del capítulo
    };

    if (loading) return <p className="text-center">Cargando historias...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Mis Historias</h2>
            <div className="row">
                {stories.map((story) => (
                    <div key={story._id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <img
                                src={story.coverImage}
                                alt={`Portada de ${story.title}`}
                                className="card-img-top"
                                style={{
                                    maxHeight: '200px',
                                    objectFit: 'cover',
                                }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{story.title}</h5>
                                <p className="card-text">{story.description}</p>
                                <div className="mb-2">
                                    <strong>Géneros:</strong>{' '}
                                    <span className="text-primary">{story.genres.join(', ')}</span>
                                </div>
                                <div className="mb-2">
                                    <strong>Clasificación:</strong>{' '}
                                    <span className="badge bg-secondary">{story.classification}</span>
                                </div>
                                <div>
                                    <strong>Etiquetas:</strong>{' '}
                                    <span className="text-info">
                                        {story.tags.length > 0 ? story.tags.join(', ') : 'Sin etiquetas'}
                                    </span>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-center gap-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleEditClick(story._id)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteClick(story._id)}
                                >
                                    Eliminar
                                </button>
                                <button
                                    className="btn btn-info"
                                    onClick={() => handleViewChapters(story)}
                                >
                                    Ver Capítulos
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para mostrar capítulos */}
            {selectedStory && (
                <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: '#4caf50' }}>
                            Capítulos de {selectedStory.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{
                            backgroundColor: '#2c2c2c',
                            color: '#f0f0f0',
                            borderRadius: '8px',
                        }}
                    >
                        {selectedStory.chapters && selectedStory.chapters.length > 0 ? (
                            <ul className="list-group">
                                {selectedStory.chapters.map((chapter, idx) => (
                                    <li
                                        key={idx}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                        style={{
                                            backgroundColor: '#1a1a1a',
                                            color: '#f0f0f0',
                                            borderRadius: '4px',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {chapter.title}
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() =>
                                                handleEditChapter(selectedStory._id, chapter._id)
                                            }
                                        >
                                            Editar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay capítulos disponibles.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Button
                            variant="success"
                            onClick={() => handleAddChapter(selectedStory._id)}
                        >
                            Agregar Capítulo
                        </Button>
                        <Button variant="secondary" onClick={() => setModalShow(false)}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default MyStories;