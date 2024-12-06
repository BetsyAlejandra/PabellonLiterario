import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Container, Form } from 'react-bootstrap';
import { FaArrowLeft, FaBook, FaArrowRight, FaCog } from 'react-icons/fa';
import '../styles/readChapter.css';

const ReadChapter = () => {
    const { storyId, chapterId } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState(16);
    const [brightness, setBrightness] = useState(100);
    const [progress, setProgress] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [generalComment, setGeneralComment] = useState('');
    const [generalComments, setGeneralComments] = useState([]);

    // Estados para el modal de anotaciones
    const [annotationModalShow, setAnnotationModalShow] = useState(false);
    const [currentAnnotation, setCurrentAnnotation] = useState('');

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                const res = await fetch(`/api/novels/${storyId}/chapters/${chapterId}`);
                if (!res.ok) {
                    throw new Error('Error al cargar el capítulo.');
                }
                const data = await res.json();
                setChapter(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el capítulo.');
                setLoading(false);
            }
        };
        fetchChapter();
    }, [storyId, chapterId]);

    useEffect(() => {
        const handleCopy = (e) => {
            e.preventDefault();
            alert('Copiar está deshabilitado en esta sección.');
        };

        const handleCut = (e) => {
            e.preventDefault();
            alert('Cortar está deshabilitado en esta sección.');
        };

        const handlePaste = (e) => {
            e.preventDefault();
            alert('Pegar está deshabilitado en esta sección.');
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            alert('El menú contextual está deshabilitado.');
        };

        const handleKeyDown = (e) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                (e.key === 'c' || e.key === 'C' ||
                    e.key === 'v' || e.key === 'V' ||
                    e.key === 'x' || e.key === 'X')
            ) {
                e.preventDefault();
                alert('Esta acción está deshabilitada en esta sección.');
            }
        };

        const readChapterElement = document.querySelector('.read-chapter');

        if (readChapterElement) {
            readChapterElement.addEventListener('copy', handleCopy);
            readChapterElement.addEventListener('cut', handleCut);
            readChapterElement.addEventListener('paste', handlePaste);
            readChapterElement.addEventListener('contextmenu', handleContextMenu);
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (readChapterElement) {
                readChapterElement.removeEventListener('copy', handleCopy);
                readChapterElement.removeEventListener('cut', handleCut);
                readChapterElement.removeEventListener('paste', handlePaste);
                readChapterElement.removeEventListener('contextmenu', handleContextMenu);
                window.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, []);

    useEffect(() => {
        // Listener para click en anotaciones
        const handleAnnotationClick = (e) => {
            const target = e.target;
            if (target.classList.contains('annotation')) {
                e.preventDefault();
                e.stopPropagation(); // Evita que el evento se propague
                const annotationText = target.getAttribute('data-annotation');
                console.log('Anotación clickeada:', annotationText); // Para depuración
                setCurrentAnnotation(annotationText);
                setAnnotationModalShow(true);
            }
        };

        const chapterContent = document.querySelector('.chapter-content');
        if (chapterContent) {
            chapterContent.addEventListener('click', handleAnnotationClick);
        }

        return () => {
            if (chapterContent) {
                chapterContent.removeEventListener('click', handleAnnotationClick);
            }
        };
    }, [chapter]);

    useEffect(() => {
        if (chapter) {
            console.log('ID Capítulo Anterior:', chapter.previous);
            console.log('ID Capítulo Siguiente:', chapter.next);
        }
    }, [chapter]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const totalHeight = scrollHeight - clientHeight;
        const scrolled = (scrollTop / totalHeight) * 100;
        setProgress(scrolled);
    };

    const handleFontSizeChange = (size) => setFontSize(size);
    const handleBrightnessChange = (value) => setBrightness(value);

    const handleCommentSubmit = () => {
        // Lógica para guardar comentario en párrafo seleccionado (si se implementa)
    };

    const handleGeneralCommentSubmit = () => {
        if (generalComment.trim()) {
            setGeneralComments((prev) => [...prev, generalComment]);
            setGeneralComment('');
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div
            className="read-chapter"
            style={{
                filter: `brightness(${brightness}%)`,
                fontSize: `${fontSize}px`,
                userSelect: 'none',
                overflowY: 'auto',
                height: '100vh',
                position: 'relative', // Para posicionar el botón flotante correctamente
            }}
            onScroll={handleScroll}
        >
            {/* Barra de progreso fija */}
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>

            <Container>
                <h2 className="chapter-title">{chapter.title}</h2>
                <p className="chapter-date">{new Date(chapter.publishedAt).toLocaleDateString()}</p>

                <div
                    className="chapter-content"
                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                ></div>
            </Container>

            {/* Modal de anotación */}
            <Modal show={annotationModalShow} onHide={() => setAnnotationModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Anotación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{currentAnnotation}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setAnnotationModalShow(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Ajustes */}
            <div className={`floating-controls`}>
                <Button
                    variant="primary"
                    className="settings-toggle"
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <FaCog />
                </Button>
                {showSettings && (
                    <div className="settings-panel">
                        <Form.Group>
                            <Form.Label>Tamaño de Letra</Form.Label>
                            <Form.Range
                                min="12"
                                max="32"
                                value={fontSize}
                                onChange={(e) => handleFontSizeChange(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Brillo</Form.Label>
                            <Form.Range
                                min="50"
                                max="150"
                                value={brightness}
                                onChange={(e) => handleBrightnessChange(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                )}
            </div>

            {/* Navegación entre capítulos */}
            <div className="chapter-navigation text-center">
                <Button
                    variant="link"
                    onClick={() => chapter.previous && navigate(`/read-chapter/${storyId}/${chapter.previous}`)}
                    disabled={!chapter.previous}
                    className="nav-btn"
                >
                    <FaArrowLeft /> Anterior
                </Button>
                <Button
                    variant="link"
                    onClick={() => navigate(`/story-detail/${storyId}`)}
                    className="nav-btn"
                >
                    <FaBook /> Contenido
                </Button>
                <Button
                    variant="link"
                    onClick={() => chapter.next && navigate(`/read-chapter/${storyId}/${chapter.next}`)}
                    disabled={!chapter.next}
                    className="nav-btn"
                >
                    Siguiente <FaArrowRight />
                </Button>
            </div>

            {/* Comentarios generales */}
            <Container className="general-comments">
                <h3>Comentarios del capítulo</h3>
                <div className="comment-list">
                    {generalComments.map((comment, idx) => (
                        <div key={idx} className="comment-item">
                            {comment}
                        </div>
                    ))}
                </div>
                <Form className="mt-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={generalComment}
                        onChange={(e) => setGeneralComment(e.target.value)}
                        placeholder="Escribe tu comentario aquí..."
                    />
                    <Button variant="primary" className="mt-2" onClick={handleGeneralCommentSubmit}>
                        Enviar
                    </Button>
                </Form>
            </Container>

            {chapter.annotations && chapter.annotations.length > 0 && (
                <Container className="annotations-list mt-4">
                    <h3>Anotaciones</h3>
                    <ul>
                        {chapter.annotations.map((ann, idx) => (
                            <li key={idx}>
                                <strong>{ann.text}:</strong> {ann.meaning}
                            </li>
                        ))}
                    </ul>
                </Container>
            )}
        </div>
    );
};

export default ReadChapter;