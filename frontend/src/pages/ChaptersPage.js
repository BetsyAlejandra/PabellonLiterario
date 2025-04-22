import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, ListGroup, Modal, Spinner, Pagination } from 'react-bootstrap';
import '../styles/ChaptersPage.css';

const ChaptersPage = () => {
    const { storyId } = useParams();
    const [story, setStory] = useState(null);
    const [userRoles, setUserRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDeleteChapterModalShow, setConfirmDeleteChapterModalShow] = useState(false);
    const [chapterToDelete, setChapterToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [chaptersPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                const res = await axios.get('/api/users/profile', { withCredentials: true });
                setUserRoles(res.data.roles || []);
            } catch (err) {
                console.error('Error al obtener roles del usuario:', err);
            }
        };

        const fetchStory = async () => {
            try {
                const res = await axios.get(`/api/novels/${storyId}`, { withCredentials: true });
                setStory(res.data);
            } catch (err) {
                setError('Error al cargar la historia.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRoles();
        fetchStory();
    }, [storyId]);

    if (!userRoles.includes('Traductor') && !userRoles.includes('Escritor')) {
        return <p>No tienes permisos para ver esta página.</p>;
    }

    const handleDeleteChapter = (chapterId, chapterTitle) => {
        setChapterToDelete({ id: chapterId, title: chapterTitle });
        setConfirmDeleteChapterModalShow(true);
    };

    const confirmDeleteChapter = async () => {
        if (!chapterToDelete) return;
        try {
            await axios.delete(`/api/novels/${storyId}/chapters/${chapterToDelete.id}`, { withCredentials: true });
            setStory(prevStory => ({
                ...prevStory,
                chapters: prevStory.chapters.filter(chapter => chapter._id !== chapterToDelete.id),
            }));
            setConfirmDeleteChapterModalShow(false);
            setChapterToDelete(null);
        } catch (err) {
            alert('Error al eliminar el capítulo. Intenta nuevamente.');
            console.error(err);
            setConfirmDeleteChapterModalShow(false);
        }
    };

    const handleAddChapter = () => {
        navigate(`/add-chapter/${storyId}`);
    };

    const handleBackToMyStories = () => {
        navigate('/my-stories');
    };

    // Paginación lógica
    const indexOfLastChapter = currentPage * chaptersPerPage;
    const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
    const currentChapters = story ? story.chapters.slice(indexOfFirstChapter, indexOfLastChapter) : [];
    const totalPages = story ? Math.ceil(story.chapters.length / chaptersPerPage) : 1;

    const getPaginationItems = () => {
        const items = [];

        if (currentPage > 1) {
            items.push(
                <Pagination.First key="first" onClick={() => setCurrentPage(1)} />,
                <Pagination.Prev key="prev" onClick={() => setCurrentPage(currentPage - 1)} />
            );
        }

        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        if (currentPage < totalPages) {
            items.push(
                <Pagination.Next key="next" onClick={() => setCurrentPage(currentPage + 1)} />,
                <Pagination.Last key="last" onClick={() => setCurrentPage(totalPages)} />
            );
        }

        return items;
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) return <p>{error}</p>;

    return (
        <div className="chapters-page-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="chapters-page-title">
                    {story ? `${story.title} - Capítulos` : 'Cargando historia...'}
                </h2>
                <Button variant="outline-secondary" onClick={handleBackToMyStories}>
                    ⬅ Volver a Mis Historias
                </Button>
            </div>
    
            <div className="text-end mb-3">
                <Button variant="success" onClick={handleAddChapter}>
                    + Agregar Capítulo
                </Button>
            </div>
    
            {/* Indicador de carga */}
            {loading ? (
                <div className="loading-spinner">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    {story.chapters && story.chapters.length > 0 ? (
                        <>
                            <ListGroup className="chapter-list">
                                {currentChapters.map((chapter) => (
                                    <ListGroup.Item key={chapter._id} className="d-flex justify-content-between align-items-center chapter-item">
                                        <span className="chapter-title">{chapter.title}</span>
                                        <div>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => navigate(`/edit-chapter/${storyId}/${chapter._id}`)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteChapter(chapter._id, chapter.title)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <div className="pagination-container mt-3">
                                <Pagination className="justify-content-center">
                                    {getPaginationItems()}
                                </Pagination>
                            </div>
                        </>
                    ) : (
                        <p>No hay capítulos disponibles para esta historia.</p>
                    )}
                </>
            )}
    
            {/* Modal de confirmación */}
            <Modal show={confirmDeleteChapterModalShow} onHide={() => setConfirmDeleteChapterModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {chapterToDelete ? (
                        <p>¿Estás seguro de que deseas eliminar el capítulo <strong>{chapterToDelete.title}</strong>? Esta acción no se puede deshacer.</p>
                    ) : (
                        <p>¿Estás seguro de que deseas eliminar este capítulo?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmDeleteChapterModalShow(false)}>
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

export default ChaptersPage;