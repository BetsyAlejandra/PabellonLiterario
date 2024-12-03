import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Container, Form } from 'react-bootstrap';
import { FaCommentDots, FaArrowLeft, FaBook, FaArrowRight, FaCog } from 'react-icons/fa';
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
    const [selectedParagraph, setSelectedParagraph] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [generalComment, setGeneralComment] = useState('');
    const [generalComments, setGeneralComments] = useState([]);

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                const res = await fetch(`https://pabellonliterario.com/api/novels/${storyId}/chapters/${chapterId}`);
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

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const totalHeight = scrollHeight - clientHeight;
        const scrolled = (scrollTop / totalHeight) * 100;
        setProgress(scrolled);
    };

    const handleFontSizeChange = (size) => setFontSize(size);
    const handleBrightnessChange = (value) => setBrightness(value);

    const handleCommentSubmit = () => {
        if (newComment.trim() && selectedParagraph !== null) {
            setComments((prev) => ({
                ...prev,
                [selectedParagraph]: [...(prev[selectedParagraph] || []), newComment],
            }));
            setNewComment('');
            setSelectedParagraph(null);
        }
    };

    const handleGeneralCommentSubmit = () => {
        if (generalComment.trim()) {
            setGeneralComments((prev) => [...prev, generalComment]);
            setGeneralComment('');
        }
    };

    if (loading) return <p>Cargando capítulo...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div
            className="read-chapter"
            style={{
                filter: `brightness(${brightness}%)`,
                fontSize: `${fontSize}px`,
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

            {/* Modal para comentarios en párrafos */}
            <Modal show={selectedParagraph !== null} onHide={() => setSelectedParagraph(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Comentarios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {comments[selectedParagraph] && (
                        <div className="comment-list">
                            {comments[selectedParagraph].map((comment, idx) => (
                                <div key={idx} className="comment-item">
                                    {comment}
                                </div>
                            ))}
                        </div>
                    )}
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe tu comentario aquí..."
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedParagraph(null)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleCommentSubmit}>
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Botón flotante para ajustes */}
            <div className={`floating-controls ${showSettings ? 'open' : ''}`}>
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
                    onClick={() => navigate(`/read-chapter/${storyId}/${chapter.previous}`)}
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
                    onClick={() => navigate(`/read-chapter/${storyId}/${chapter.next}`)}
                    disabled={!chapter.next}
                    className="nav-btn"
                >
                    Siguiente <FaArrowRight />
                </Button>
            </div>

            {/* Sección de comentarios generales */}
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
        </div>
    );
};

export default ReadChapter;