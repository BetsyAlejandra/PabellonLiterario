// src/components/MyStories.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Modal, Button, Card, Form, Pagination } from 'react-bootstrap';
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
    const [confirmDeleteChapterModalShow, setConfirmDeleteChapterModalShow] = useState(false); // Modal de confirmación de eliminación de capítulo
    const [userRoles, setUserRoles] = useState([]);
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const storiesPerPage = 6;
    const [searchParams, setSearchParams] = useSearchParams();

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSearchParams({ page });
    };

    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;

        const fetchUserStories = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/novels/my-stories?page=${page}&limit=${storiesPerPage}`, {
                    withCredentials: true,
                });

                setStories(res.data.stories);
                setTotalPages(res.data.totalPages);
                setCurrentPage(page); // Asegura sincronía
            } catch (err) {
                setError(err.response?.data?.message || 'Error al cargar las historias.');
            } finally {
                setLoading(false);
            }
        };

        const fetchUserRoles = async () => {
            try {
                const res = await axios.get('/api/users/profile', { withCredentials: true });
                setUserRoles(res.data.roles || []);
            } catch (err) {
                console.error('Error al obtener roles del usuario:', err);
            }
        };

        fetchUserStories();
        fetchUserRoles();
    }, [searchParams]);

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
        navigate(`/chapters/${story._id}`);
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
        setConfirmDeleteChapterModalShow(true);
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

            setConfirmDeleteChapterModalShow(false); // Cierra el modal de confirmación
            setChapterToDelete(null); // Resetea el capítulo a eliminar
        } catch (err) {
            alert('Error al eliminar el capítulo. Intenta nuevamente.');
            console.error(err);
            setConfirmDeleteChapterModalShow(false); // Cierra el modal de confirmación
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);



    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2">Cargando historias...</p>
            </div>
        );
    }
    if (error) return <p className="my-stories-error">{error}</p>;

    return (
        <div className="my-stories-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="my-stories-title">Mis Historias</h2>
                {(userRoles.includes('Traductor') || userRoles.includes('Escritor')) && (
                    <Button className="my-stories-add-button" onClick={handleAddNovel}>
                        Agregar Nueva Novela
                    </Button>
                )}
            </div>

            <div className="my-stories-list container">
                {stories.length === 0 ? (
                    <div className="text-center text-muted mt-5">
                        <p>No has subido ninguna historia aún.</p>
                    </div>
                ) : (
                    <div className="row justify-content-center">
                        {stories.map((story) => (
                            <div key={story._id} className="col-md-10">
                                <div className="my-stories-item d-flex flex-column flex-md-row align-items-start">
                                    <img
                                        src={story.coverImage || '/default-cover.jpg'}
                                        alt={story.title}
                                        className="my-stories-item-image"
                                    />
                                    <div className="flex-grow-1 ms-md-3 mt-3 mt-md-0">
                                        <h5 className="my-stories-item-title">{story.title}</h5>
                                        <p className="my-stories-item-description">
                                            {story.description.substring(0, 150)}...
                                            <button
                                                className="my-stories-read-more-button"
                                                onClick={() => handleViewDescription(story.description)}
                                            >
                                                Leer más
                                            </button>
                                        </p>
                                        <div className="my-stories-item-meta mb-2">
                                            <span><strong>Géneros:</strong> {story.genres.join(', ')}</span><br />
                                            <span><strong>Clasificación:</strong> {story.classification}</span><br />
                                            <span><strong>Etiquetas:</strong> {story.tags.length > 0 ? story.tags.join(', ') : 'Sin etiquetas'}</span>
                                        </div>
                                        <div className="my-stories-item-actions d-flex flex-wrap gap-2 mt-2">
                                            <Button variant="primary" className="my-stories-action-button" onClick={() => handleEditClick(story._id)}>Editar</Button>
                                            <Button variant="danger" className="my-stories-action-button" onClick={() => handleDeleteClick(story._id)}>Eliminar</Button>
                                            <Button variant="info" className="my-stories-action-button" onClick={() => handleViewChapters(story)}>Capítulos</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Pagination>
                <Pagination.Prev onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} />
                {[...Array(Math.max(totalPages, 1))].map((_, index) => {
                    const page = index + 1;
                    return (
                        <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                            {page}
                        </Pagination.Item>
                    );
                })}
                <Pagination.Next onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} disabled={totalPages === 0 || currentPage === totalPages} />
            </Pagination>

            {/* Modales de Descripción y Confirmación */}
            <Modal show={descriptionModalShow} onHide={() => setDescriptionModalShow(false)} centered>
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

            {/* Modal de Confirmación de Eliminación */}
            <Modal show={confirmModalShow} onHide={() => setConfirmModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar esta historia? Esta acción no se puede deshacer.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmModalShow(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );



};

export default MyStories;