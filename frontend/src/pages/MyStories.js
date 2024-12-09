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
    const [confirmModalShow, setConfirmModalShow] = useState(false); // Modal de confirmación
    const [descriptionModalShow, setDescriptionModalShow] = useState(false); // Modal para descripción completa
    const [selectedStory, setSelectedStory] = useState(null); // Historia seleccionada
    const [selectedDescription, setSelectedDescription] = useState(''); // Descripción seleccionada
    const [storyToDelete, setStoryToDelete] = useState(null); // Historia a eliminar
    const [confirmDeleteModalShow, setConfirmDeleteModalShow] = useState(false); // Modal de confirmación de eliminación
    const [chapterToDelete, setChapterToDelete] = useState(null); // Capítulo a eliminar
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                const res = await axios.get('/api/novels/my-stories', {
                    withCredentials: true,
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

    const handleDeleteClick = (id) => {
        setStoryToDelete(id); // Establece la historia a eliminar
        setConfirmModalShow(true); // Muestra el modal de confirmación
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/novels/${storyToDelete}`, {
                withCredentials: true,
            });
            setStories((prevStories) =>
                prevStories.filter((story) => story._id !== storyToDelete)
            );
            setStoryToDelete(null);
            setConfirmModalShow(false); // Cierra el modal
        } catch (err) {
            alert('Error al eliminar la historia. Intenta nuevamente.');
            console.error(err);
        }
    };

    const handleAddChapter = (id) => {
        navigate(`/add-chapter/${id}`);
    };

    const handleViewChapters = (story) => {
        setSelectedStory(story);
        setModalShow(true);
    };

    const handleEditChapter = (storyId, chapterId) => {
        navigate(`/edit-chapter/${storyId}/${chapterId}`);
    };

    const handleViewDescription = (description) => {
        setSelectedDescription(description);
        setDescriptionModalShow(true);
    };

    const handleAddNovel = () => {
        navigate('/upload');
    };


    const handleDeleteChapter = (storyId, chapterId, chapterTitle) => {
        console.log('Eliminando capítulo:', { storyId, chapterId, chapterTitle });
        setChapterToDelete({ id: chapterId, title: chapterTitle, storyId });
        setConfirmDeleteModalShow(true);
    };

    // Función para confirmar la eliminación del capítulo
    const confirmDeleteChapter = async () => {
        if (!chapterToDelete) return;

        console.log('Confirmando eliminación de capítulo:', chapterToDelete);

        try {
            await axios.delete(`/api/novels/${chapterToDelete.storyId}/chapters/${chapterToDelete.id}`, {
                withCredentials: true,
            });
            // Actualiza el estado de las historias eliminando el capítulo
            setStories((prevStories) =>
                prevStories.map((story) => {
                    if (story._id === chapterToDelete.storyId) {
                        return {
                            ...story,
                            chapters: story.chapters.filter(
                                (chapter) => chapter._id !== chapterToDelete.id
                            ),
                        };
                    }
                    return story;
                })
            );

            setConfirmDeleteModalShow(false); // Cierra el modal de confirmación
            setChapterToDelete(null); // Resetea el capítulo a eliminar
        } catch (err) {
            alert('Error al eliminar el capítulo. Intenta nuevamente.');
            console.error(err);
            setConfirmDeleteModalShow(false); // Cierra el modal de confirmación
        }
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
                                <p className="card-text">
                                    {story.description.substring(0, 100)}...
                                    <button
                                        className="btn btn-link p-0"
                                        onClick={() => handleViewDescription(story.description)}
                                    >
                                        Leer más
                                    </button>
                                </p>
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
                    <Modal.Body style={{ backgroundColor: '#2c2c2c', color: '#f0f0f0' }}>
                        {selectedStory.chapters && selectedStory.chapters.length > 0 ? (
                            <ul className="list-group">
                                {selectedStory.chapters.map((chapter, idx) => (
                                    <li
                                        key={chapter._id} // Usar _id como key para mayor unicidad
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                        style={{
                                            backgroundColor: '#1a1a1a',
                                            color: '#f0f0f0',
                                            borderRadius: '4px',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {chapter.title}
                                        <div>
                                            <button
                                                className="btn btn-outline-primary btn-sm me-2"
                                                onClick={() =>
                                                    handleEditChapter(selectedStory._id, chapter._id)
                                                }
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() =>
                                                    handleDeleteChapter(selectedStory._id, chapter._id, chapter.title)
                                                }
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay capítulos disponibles.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => handleAddChapter(selectedStory._id)}>
                            Agregar Capítulo
                        </Button>
                        <Button variant="secondary" onClick={() => setModalShow(false)}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}


            {/* Modal para mostrar descripción completa */}
            <Modal
                show={descriptionModalShow}
                onHide={() => setDescriptionModalShow(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Descripción</Modal.Title>
                </Modal.Header>
                <Modal.Body>{selectedDescription}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDescriptionModalShow(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmación */}
            <Modal
                show={confirmModalShow}
                onHide={() => setConfirmModalShow(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar esta historia?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmModalShow(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmación para eliminar capítulo */}
            <Modal
                show={confirmDeleteModalShow}
                onHide={() => setConfirmDeleteModalShow(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {chapterToDelete ? (
                        <p>
                            ¿Estás seguro de que deseas eliminar el capítulo <strong>{chapterToDelete.title}</strong>?
                            Esta acción no se puede deshacer.
                        </p>
                    ) : (
                        <p>¿Estás seguro de que deseas eliminar este capítulo?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmDeleteModalShow(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteChapter}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default MyStories;