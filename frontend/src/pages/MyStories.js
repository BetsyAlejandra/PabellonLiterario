// src/components/MyStories.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Card, Form } from 'react-bootstrap';
import '../styles/MyStories.css'; // Importa el archivo CSS específico

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
    const [userRoles, setUserRoles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const chaptersPerPage = 5; // Número de capítulos por página
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

        // Obtener roles del usuario
        const fetchUserRoles = async () => {
            try {
                const res = await axios.get('/api/users/profile', { withCredentials: true });
                setUserRoles(res.data.roles || []); // Suponiendo que `roles` es un array
            } catch (err) {
                console.error('Error al obtener roles del usuario:', err);
            }
        };
        fetchUserStories();
        fetchUserRoles();
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
        setCurrentPage(1); // Reinicia la página a la primera
        setModalShow(true);
    };

    // Lógica de paginación
    const indexOfLastChapter = currentPage * chaptersPerPage;
    const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
    const currentChapters = selectedStory?.chapters.slice(indexOfFirstChapter, indexOfLastChapter);

    const nextPage = () => {
        if (currentPage < Math.ceil(selectedStory?.chapters.length / chaptersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
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

    if (loading) return <p className="my-stories-loading">Cargando historias...</p>;
    if (error) return <p className="my-stories-error">{error}</p>;

    return (
        <div className="my-stories-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="my-stories-title">Mis Historias</h2>
                {/* Renderizar el botón solo si tiene el rol adecuado */}
                {userRoles.includes('Traductor') || userRoles.includes('Escritor') ? (
                    <Button className="my-stories-add-button" onClick={handleAddNovel}>
                        Agregar Nueva Novela
                    </Button>
                ) : null}
            </div>
            <div className="row">
                {stories.map((story) => (
                    <div key={story._id} className="col-md-6 col-lg-4 mb-4">
                        <Card className="my-stories-card shadow-sm h-100">
                            <div className="my-stories-card-image-container">
                                <Card.Img
                                    src={story.coverImage}
                                    alt={`Portada de ${story.title}`}
                                    className="my-stories-card-image"
                                />
                            </div>
                            <Card.Body className="d-flex flex-column">
                                <h5 className="my-stories-card-title">{story.title}</h5>
                                <p className="my-stories-card-text">
                                    {story.description.substring(0, 100)}...
                                    <button
                                        className="my-stories-read-more-button btn btn-link p-0"
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
                                <div className="mb-3">
                                    <strong>Etiquetas:</strong>{' '}
                                    <span className="text-info">
                                        {story.tags.length > 0 ? story.tags.join(', ') : 'Sin etiquetas'}
                                    </span>
                                </div>
                                {/* Botones de Acción */}
                                <div className="mt-auto d-flex justify-content-center gap-3">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleEditClick(story._id)}
                                        className="my-stories-action-button"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteClick(story._id)}
                                        className="my-stories-action-button"
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        variant="info"
                                        onClick={() => handleViewChapters(story)}
                                        className="my-stories-action-button"
                                    >
                                        Ver Capítulos
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Modal para mostrar capítulos */}
            {/* Modal de capítulos */}
            {selectedStory && (
                <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Capítulos de {selectedStory.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {currentChapters && currentChapters.length > 0 ? (
                            <ul>
                                {currentChapters.map((chapter, index) => (
                                    <li key={index}>
                                        <span>{chapter.title}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay capítulos disponibles.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex justify-content-between w-100">
                            <Button
                                variant="secondary"
                                onClick={prevPage}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <span>
                                Página {currentPage} de{' '}
                                {Math.ceil(selectedStory?.chapters.length / chaptersPerPage)}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={nextPage}
                                disabled={
                                    currentPage >= Math.ceil(selectedStory?.chapters.length / chaptersPerPage)
                                }
                            >
                                Siguiente
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Modal para mostrar descripción completa */}
            <Modal
                show={descriptionModalShow}
                onHide={() => setDescriptionModalShow(false)}
                centered
                className="my-stories-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="my-stories-modal-title">Descripción</Modal.Title>
                </Modal.Header>
                <Modal.Body className="my-stories-modal-body">{selectedDescription}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDescriptionModalShow(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmación para eliminar historia */}
            <Modal
                show={confirmModalShow}
                onHide={() => setConfirmModalShow(false)}
                centered
                className="my-stories-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="my-stories-modal-title">Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body className="my-stories-modal-body">
                    ¿Estás seguro de que deseas eliminar esta historia? Esta acción no se puede deshacer.
                </Modal.Body>
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
                className="my-stories-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="my-stories-modal-title">Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body className="my-stories-modal-body">
                    {chapterToDelete ? (
                        <p>
                            ¿Estás seguro de que deseas eliminar el capítulo <strong>{chapterToDelete.title}</strong>? Esta acción no se puede deshacer.
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