import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, OverlayTrigger, Popover, Toast, ToastContainer, Modal } from 'react-bootstrap';
import { FaArrowLeft, FaBook, FaArrowRight, FaCog, FaQuoteRight } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import parse, { domToReact } from 'html-react-parser';
import '../styles/readChapter.css';
import { useReadChapter } from "../context/ReadChapterContext";
import html2canvas from 'html2canvas';
import backgroundImage from '../assets/background.png';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { useLocation } from "react-router-dom";
import { ThemeContext } from '../context/ThemeContext';
import he from 'he';


const fontOptions = [
    { label: "Serif", value: "Serif" },
    { label: "Georgia", value: "Georgia" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Arial", value: "Arial" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Verdana", value: "Verdana" },
    { label: "Courier New", value: "Courier New" },
    { label: "Lucida Console", value: "Lucida Console" }
];

const colorOptions = [
    { label: "Negro", value: "#000000" },
    { label: "Lavanda Claro", value: "#D3D0E1" },
    { label: "Verde Pastel Suave", value: "#C9D6D5" },
    { label: "Crema Suave", value: "#E6D6C3" },
    { label: "Rosa Claro", value: "#F0E1D6" },
    { label: "Marrón Arena", value: "#D6B4A1" },
    { label: "Azul Pastel Pálido", value: "#D7E2E9" }
];


const ReadChapter = () => {
    const { storyId, chapterId } = useParams();
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const { markChapterAsRead, isChapterRead } = useReadChapter();

    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [progress, setProgress] = useState(0);
    const [generalComment, setGeneralComment] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    const [paragraphs, setParagraphs] = useState([]);
    const [showCommentBox, setShowCommentBox] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState({});
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const [showModal, setShowModal] = useState(null);
    const [paragraphIndex, setParagraphIndex] = useState(null);

    const [selectedText, setSelectedText] = useState('');
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [novelName, setNovelName] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem("fontSize")) || 16);
    const [fontColor, setFontColor] = useState(() => localStorage.getItem("fontColor") || "#000000");
    const [fontFamily, setFontFamily] = useState(() => localStorage.getItem("fontFamily") || "Serif");
    const [brightness, setBrightness] = useState(() => Number(localStorage.getItem("brightness")) || 100);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const chapterContainerRef = useRef(null);
    const popoverIdRef = useRef(0);

    const location = useLocation();


    useEffect(() => {
        const fetchChapterAndStory = async () => {
            try {
                const resChapter = await fetch(`/api/novels/${storyId}/chapters/${chapterId}`);
                if (!resChapter.ok) {
                    throw new Error('Error al cargar el capítulo.');
                }
                const dataChapter = await resChapter.json();
                setChapter(dataChapter);
                setParagraphs(dataChapter.content.split("\n").filter((p) => p.trim() !== ""));
                setLoading(false);

                if (dataChapter.novelTitle) {
                    setNovelName(dataChapter.novelTitle);
                } else {
                    const resStory = await fetch(`/api/novels/${storyId}`);
                    if (!resStory.ok) {
                        throw new Error('Error al cargar los detalles de la novela.');
                    }
                    const dataStory = await resStory.json();
                    setNovelName(dataStory.title);
                }
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos.');
                setLoading(false);
            }
        };
        fetchChapterAndStory();
    }, [storyId, chapterId]);

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (text.length > 0) {
                setSelectedText(text);
                setShowDownloadButton(true);
            } else {
                setShowDownloadButton(false);
            }
        };

        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('keyup', handleSelection);
        document.addEventListener('touchend', handleSelection);

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('keyup', handleSelection);
            document.removeEventListener('touchend', handleSelection);
        };
    }, [chapter]);

    useEffect(() => {
        const handleCopy = (e) => {
            e.preventDefault();
            setToastMessage('Copiar está deshabilitado en esta sección.');
            setShowToast(true);
        };

        const handleCut = (e) => {
            e.preventDefault();
            setToastMessage('Cortar está deshabilitado en esta sección.');
            setShowToast(true);
        };

        const handlePaste = (e) => {
            e.preventDefault();
            setToastMessage('Pegar está deshabilitado en esta sección.');
            setShowToast(true);
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            setToastMessage('El menú está deshabilitado en esta sección.');
            setShowToast(true);
        };

        const handleKeyDown = (e) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                ['c', 'C', 'v', 'V', 'x', 'X'].includes(e.key)
            ) {
                e.preventDefault();
                setToastMessage('Esta acción está deshabilitada en esta sección.');
                setShowToast(true);
            }
        };

        document.addEventListener('copy', handleCopy);
        document.addEventListener('cut', handleCut);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('cut', handleCut);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (chapterContainerRef.current) {
            chapterContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [chapter]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const totalHeight = scrollHeight - clientHeight;
        const scrolled = (scrollTop / totalHeight) * 100;
        setProgress(scrolled);
    };

    const handleTextSelection = (e, index) => {
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (selectedText.trim().length > 0) {
            setSelectedText(selectedText);
            setShowCommentBox(index);
            setParagraphIndex(index);

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setButtonPosition({
                top: rect.bottom + window.scrollY - 10,
                left: rect.left + window.scrollX + (rect.width / 2) - 20,
            });
        } else {
            setShowCommentBox(null);
            setShowModal(null);
            setSelectedText("");
            setParagraphIndex(null);
        }
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFontSizeChange = (size) => {
        setFontSize(Number(size));
        localStorage.setItem("fontSize", size);
    };

    const handleFontColorChange = (color) => {
        setFontColor(color);
        localStorage.setItem("fontColor", color);
    };

    const handleFontFamilyChange = (family) => {
        setFontFamily(family);
        localStorage.setItem("fontFamily", family);
    };

    const handleBrightnessChange = (value) => {
        setBrightness(Number(value));
        localStorage.setItem("brightness", value);
    };

    const filteredFonts = isMobile
        ? fontOptions.filter((font) =>
            ["Serif", "Sans-serif", "Monospace"].some((type) => font.label.includes(type))
        )
        : fontOptions;


    const renderPopover = (annotation) => {
        const decodedAnnotation = he.decode(annotation);

        return (
            <Popover id={`popover-${popoverIdRef.current++}`} >
                <Popover.Header as="h3">Anotación</Popover.Header>
                <Popover.Body>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(decodedAnnotation) }} />
                </Popover.Body>

            </Popover>
        )
    };





    const sanitizeOptions = {
        ADD_ATTR: ['data-annotation', 'class', 'src', 'alt']
    };

    const sanitizedContent = chapter ? DOMPurify.sanitize(chapter.content, sanitizeOptions) : '';
    const options = {
        replace: ({ name, attribs, children }) => {
            if (!attribs) return;
            if (name === 'span' && attribs['data-annotation']) {
                const annotationText = attribs['data-annotation'];
                return (
                    <OverlayTrigger
                        trigger="click"
                        placement="top"
                        overlay={renderPopover(annotationText)}
                        container={chapterContainerRef.current}
                        rootClose
                    >
                        <span className="annotation"
                            style={{ cursor: 'pointer', color: '#2A2A2A' }}
                        >
                            {domToReact(children, options)}
                        </span>
                    </OverlayTrigger>
                );
            }

            if (name === 'img') {
                return (
                    <img
                        src={attribs.src}
                        alt={attribs.alt || 'Imagen'}
                        style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
                    />
                );
            }

            if (name === 'hr') {
                return <hr />;
            }
        }
    };


    const navigateToNext = () => {
        if (chapter.next) {
            navigate(`/read-chapter/${storyId}/${chapter.next}`);
        }
    };


    useEffect(() => {
        if (chapter && chapter._id) {
            markChapterAsRead(chapter._id);
        }
    }, [location.pathname, chapter]);

    const handleDownload = async () => {
        if (!selectedText) return;

        // Crear un nuevo objeto Image para asegurarse de que la imagen de fondo se carga correctamente
        const img = new Image();
        img.src = backgroundImage;
        img.crossOrigin = 'anonymous'; // Importante para CORS

        img.onload = async () => {
            // Crear un elemento temporal con dimensiones aumentadas
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'fixed';
            tempDiv.style.top = '50%';
            tempDiv.style.left = '50%';
            tempDiv.style.width = '1200px'; // Aumentar ancho
            tempDiv.style.height = '1200px'; // Aumentar altura
            tempDiv.style.transform = 'translate(-50%, -50%)';
            tempDiv.style.display = 'flex';
            tempDiv.style.flexDirection = 'column';
            tempDiv.style.justifyContent = 'center';
            tempDiv.style.alignItems = 'center';
            tempDiv.style.padding = '20px';
            tempDiv.style.boxSizing = 'border-box';
            tempDiv.style.border = '3px solid #FFD700';
            tempDiv.style.borderRadius = '20px';
            tempDiv.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.7)';
            tempDiv.style.opacity = '0.95';
            tempDiv.style.overflow = 'visible'; // Permitir overflow
            tempDiv.style.backgroundColor = 'transparent'; // Fondo transparente para ver las capas

            // Añadir una capa de fondo desenfocada
            const backgroundLayer = document.createElement('div');
            backgroundLayer.style.position = 'absolute';
            backgroundLayer.style.top = '0';
            backgroundLayer.style.left = '0';
            backgroundLayer.style.width = '100%';
            backgroundLayer.style.height = '100%';
            backgroundLayer.style.backgroundImage = `url(${backgroundImage})`;
            backgroundLayer.style.backgroundSize = 'cover';
            backgroundLayer.style.backgroundPosition = 'center';
            backgroundLayer.style.filter = 'blur(8px)'; // Aplicar desenfoque
            backgroundLayer.style.zIndex = '1';
            backgroundLayer.style.borderRadius = '20px';

            // Añadir una capa de superposición para oscurecer el fondo y mejorar la legibilidad
            const overlayLayer = document.createElement('div');
            overlayLayer.style.position = 'absolute';
            overlayLayer.style.top = '0';
            overlayLayer.style.left = '0';
            overlayLayer.style.width = '100%';
            overlayLayer.style.height = '100%';
            overlayLayer.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
            overlayLayer.style.zIndex = '2';
            overlayLayer.style.borderRadius = '20px';

            // Crear el contenido de la imagen
            const contentDiv = document.createElement('div');
            contentDiv.style.position = 'relative'; // Posición relativa para estar encima de las capas anteriores
            contentDiv.style.zIndex = '3'; // Asegurar que esté encima de las capas de fondo y superposición
            contentDiv.style.background = 'rgba(0, 0, 0, 0.6)'; // Fondo semi-transparente para el texto
            contentDiv.style.padding = '20px';
            contentDiv.style.borderRadius = '15px';
            contentDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            contentDiv.style.width = '90%';
            contentDiv.style.maxHeight = '90%'; // Limitar la altura para evitar desbordamientos
            contentDiv.style.display = 'flex';
            contentDiv.style.flexDirection = 'column';
            contentDiv.style.justifyContent = 'center';
            contentDiv.style.alignItems = 'center';
            contentDiv.style.wordWrap = 'break-word'; // Permite que el texto se envuelva
            contentDiv.style.textAlign = 'center'; // Centrar el texto
            contentDiv.style.overflowY = 'auto'; // Añadir scroll si el contenido excede

            // Crear elementos de texto
            const phraseElement = document.createElement('p');
            phraseElement.innerText = selectedText;
            phraseElement.style.fontSize = '32px';
            phraseElement.style.fontWeight = 'bold';
            phraseElement.style.marginBottom = '15px';
            phraseElement.style.fontStyle = 'italic';
            phraseElement.style.color = '#FFD700'; // Dorado
            phraseElement.style.wordWrap = 'break-word'; // Permite que el texto se envuelva
            phraseElement.style.maxWidth = '100%'; // Asegura que el texto no exceda el contenedor

            const sourceElement = document.createElement('p');
            sourceElement.innerText = `- De la novela "${novelName}"`;
            sourceElement.style.fontSize = '24px';
            sourceElement.style.fontFamily = 'Lucida Console, Monaco, monospace'; // Fuente diferente para el origen
            sourceElement.style.opacity = '0.9'; // Texto más sutil
            sourceElement.style.color = '#FFD700'; // Dorado
            sourceElement.style.wordWrap = 'break-word'; // Permite que el texto se envuelva
            sourceElement.style.maxWidth = '100%'; // Asegura que el texto no exceda el contenedor

            // Añadir los elementos de texto al contenido
            contentDiv.appendChild(phraseElement);
            contentDiv.appendChild(sourceElement);

            // Añadir las capas y el contenido al div temporal
            tempDiv.appendChild(backgroundLayer);
            tempDiv.appendChild(overlayLayer);
            tempDiv.appendChild(contentDiv);
            document.body.appendChild(tempDiv);

            // Esperar un breve momento para asegurar que el DOM ha renderizado los elementos
            await new Promise(resolve => setTimeout(resolve, 500));

            try {
                const canvas = await html2canvas(tempDiv, { useCORS: true, scale: 2, allowTaint: false });
                const imgData = canvas.toDataURL('image/png');

                // Crear un enlace para descargar la imagen
                const link = document.createElement('a');
                link.href = imgData;
                link.download = 'frase.png';
                link.click();
            } catch (error) {
                console.error('Error al generar la imagen:', error);
                alert('Hubo un problema al generar la imagen. Por favor, intenta de nuevo.');
            }

            // Eliminar el elemento temporal del DOM
            document.body.removeChild(tempDiv);
        };

        // Agregar una función de fallback en caso de que la imagen no se cargue
        img.onerror = () => {
            alert('Error al cargar la imagen de fondo. Por favor, verifica la ruta de la imagen.');
        };
    };

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(`/api/novels/${storyId}/chapter/${chapterId}/comments`);
            setComments(data.comments.reduce((acc, comment) => {
                acc[comment.paragraphIndex] = acc[comment.paragraphIndex] || [];
                acc[comment.paragraphIndex].push({
                    comment: comment.comment,
                    selectedText: comment.selectedText
                });
                return acc;
            }, {}));
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleComment = async () => {
        if (comment.trim() && paragraphIndex !== null) {
            try {
                await axios.post(`/api/novels/${storyId}/chapter/${chapterId}/comment`, {
                    paragraphIndex,
                    comment,
                    selectedText,
                });

                fetchComments();
                setComment('');
                setSelectedText('');
                setParagraphIndex(null);
                setShowModal(null);
            } catch (error) {
                console.error("Error al enviar comentario:", error);
            }
        } else {
            console.warn("No se ha seleccionado texto o el comentario está vacío");
        }
    };


    if (loading) return <p className="read-chapter-loading">Cargando...</p>;
    if (error) return <p className="read-chapter-error">{error}</p>;

    return (
        <div className={`read-chapter-wrapper ${darkMode ? 'dark-mode' : ''}`}>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="read-chapter" ref={chapterContainerRef} onScroll={handleScroll}
                style={{
                    '--brightness': `${brightness}%`,
                    '--font-size': `${fontSize}px`,
                    '--font-color': fontColor,
                    '--font-family': fontFamily,
                    userSelect: 'text',
                    overflowY: 'auto',
                    height: '100vh',
                    position: 'relative',
                }}
            >
                {/* Botón flotante para volver al contenido */}
                <div className="floating-top-button">
                    <Button
                        variant="info"
                        className="go-to-content-btn"
                        onClick={() => navigate(`/story-detail/${storyId}`)}
                        aria-label="Volver al contenido"
                    >
                        <FaBook />
                    </Button>
                </div>


                <Container>
                    {/* Título de la Novela */}
                    <h1 className="story-title">{novelName}</h1>

                    {/* Título del Capítulo */}
                    <h2 className="chapter-title">{chapter.title}</h2>
                    <p className="chapter-date">{new Date(chapter.publishedAt).toLocaleDateString()}</p>

                    <div className="chapter-content">
                        {paragraphs.map((para, index) => (
                            <div key={index} className="paragraph">
                                <div className="paragraph-container">
                                    <p
                                        draggable='false'
                                        onMouseUp={(e) => handleTextSelection(e, index)}
                                        onTouchEnd={(e) => handleTextSelection(e, index)}
                                        onDragStart={(e) => e.preventDefault}
                                    >
                                        {console.log("Anotación:", para)}
                                        {parse(DOMPurify.sanitize(para, sanitizeOptions), options)

                                        }
                                    </p>


                                    {showCommentBox === index && (
                                        <div
                                            className="comment-button"
                                            style={{
                                                position: 'absolute',
                                                top: buttonPosition.top,
                                                left: buttonPosition.left,
                                                zIndex: 99
                                            }}
                                        >
                                            <button onClick={() => setShowModal(index)}>
                                                💬 {comments[index]?.length > 0 && (
                                                    <span className="comment-counter">
                                                        {comments[index].length}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {showModal === index && (
                                        <div className="comment-modal">
                                            <div className="modal-content">
                                                <textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Escribe tu comentario..."
                                                />
                                                <div className="modal-buttons">
                                                    <button onClick={() => handleComment(index)}>
                                                        Enviar
                                                    </button>
                                                    <button onClick={() => setShowModal(null)}>
                                                        Cancelar
                                                    </button>
                                                </div>

                                                {Array.isArray(comments[index]) && comments[index].length > 0 && (
                                                    <div className="comment-list">
                                                        <h4>Comentarios:</h4>
                                                        {comments[index].map((com, i) => (
                                                            <div key={i} className="comment-item">
                                                                <div className="highlighted-text">{com.selectedText}</div>
                                                                <div className="comment-text">{com.comment}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>

                </Container>

                {/* Botón de ajustes */}
                <div className="fixed-settings">
                    <Button
                        variant="secondary"
                        className="settings-toggle"
                        onClick={() => setShowSettings((prev) => !prev)}
                        aria-label="Abrir ajustes de lectura"
                    >
                        <FaCog />
                    </Button>
                    {showSettings && (
                        <div className="settings-panel">
                            <Form.Group className="mb-3">
                                <Form.Label className="fixed-label">Tamaño de Letra</Form.Label>
                                <Form.Range min="12" max="32" value={fontSize} onChange={(e) => handleFontSizeChange(e.target.value)} />
                                <div className="text-end">{fontSize}px</div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fixed-label">Color de Fuente</Form.Label>
                                <Form.Select value={fontColor} onChange={(e) => handleFontColorChange(e.target.value)}>
                                    {colorOptions.map((color) => (
                                        <option key={color.value} value={color.value}>
                                            {color.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fixed-label">Fuente</Form.Label>
                                <Form.Select value={fontFamily} onChange={(e) => handleFontFamilyChange(e.target.value)}>
                                    {filteredFonts.map((font) => (
                                        <option key={font.value} value={font.value}>
                                            {font.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fixed-label">Brillo</Form.Label>
                                <Form.Range min="50" max="150" value={brightness} onChange={(e) => handleBrightnessChange(e.target.value)} />
                                <div className="text-end">{brightness}%</div>
                            </Form.Group>
                        </div>
                    )}
                </div>

                {/* Navegación entre capítulos */}
                <div className="chapter-navigation">
                    <Button
                        variant="link"
                        aria-label="Capítulo anterior"
                        onClick={() => {
                            if (chapter.previous) {
                                navigate(`/read-chapter/${storyId}/${chapter.previous}`);
                            }
                        }}
                        disabled={!chapter.previous}
                        className="nav-btn"
                    >
                        <FaArrowLeft /> Anterior
                    </Button>
                    <Button
                        variant="link"
                        aria-label="Contenido"
                        onClick={() => navigate(`/story-detail/${storyId}`)}
                        className="nav-btn"
                    >
                        <FaBook /> Contenido
                    </Button>
                    <Button
                        variant="link"
                        aria-label="Capítulo siguiente"
                        onClick={navigateToNext}
                        disabled={!chapter.next}
                        className="nav-btn"
                    >
                        Siguiente <FaArrowRight />
                    </Button>
                </div>

                <Container className="general-comments">
                    <h3>Comentarios del capítulo</h3>
                    <DiscussionEmbed
                        shortname="pabellonliterario"
                        config={{
                            url: `${window.location.origin}/read-chapter/${storyId}/${chapterId}`,
                            identifier: `${chapterId}`,
                            title: `${chapter?.title || 'Capítulo'}`,
                            language: 'es',
                        }}
                    />
                </Container>


                {chapter.annotations && chapter.annotations.length > 0 && (
                    <Container className="annotations-list mt-4">
                        <h3>Anotaciones</h3>
                        <ul>
                            {chapter.annotations.map((ann, idx) => (
                                <li key={idx}>
                                    <strong>{ann.text}:</strong>
                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ann.meaning) }} />
                                </li>
                            ))}
                        </ul>
                    </Container>
                )}

                {/* Contenedor de Toasts */}
                <ToastContainer position="bottom-end" className="p-3">
                    <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="warning">
                        <Toast.Header>
                            <strong className="me-auto">Aviso</strong>
                        </Toast.Header>
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>

            {/* Botón Flotante de Descarga */}
            {showDownloadButton && (
                <div className="floating-download-button">
                    <Button
                        variant="success"
                        onClick={handleDownload}
                        title="Descargar frase"
                        aria-label="Descargar frase seleccionada"
                    >
                        <FaQuoteRight /> Descargar
                    </Button>
                </div>
            )}
        </div>
    );

};

export default ReadChapter;