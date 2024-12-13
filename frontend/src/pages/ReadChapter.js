// src/components/ReadChapter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, OverlayTrigger, Popover, Toast, ToastContainer } from 'react-bootstrap';
import { FaArrowLeft, FaBook, FaArrowRight, FaCog, FaQuoteRight } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import parse, { domToReact } from 'html-react-parser';
import '../styles/readChapter.css';
import AdSense from '../Components/AdSense';
import html2canvas from 'html2canvas';
import backgroundImage from '../assets/background.png';

const ReadChapter = () => {
    const { storyId, chapterId } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [progress, setProgress] = useState(0); // Estado para el progreso de la barra de lectura
    const [generalComment, setGeneralComment] = useState(''); // Comentario actual
    const [generalComments, setGeneralComments] = useState([]); // Lista de comentarios generales
    const [showSettings, setShowSettings] = useState(false); // Panel de ajustes visible


    // Inicialización de estados desde localStorage
    const [fontSize, setFontSize] = useState(() => {
        const storedFontSize = localStorage.getItem('fontSize');
        return storedFontSize ? Number(storedFontSize) : 16;
    });

    const [brightness, setBrightness] = useState(() => {
        const storedBrightness = localStorage.getItem('brightness');
        return storedBrightness ? Number(storedBrightness) : 100;
    });

    const [fontColor, setFontColor] = useState(() => {
        const storedFontColor = localStorage.getItem('fontColor');
        return storedFontColor || "#FBFCFC";
    });

    // Estados para la selección de texto y descarga de imagen
    const [selectedText, setSelectedText] = useState('');
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [novelName, setNovelName] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Ref para generar IDs únicos para los Popovers
    const popoverIdRef = useRef(0);

    useEffect(() => {
        const fetchChapterAndStory = async () => {
            try {
                // Solicitar los datos del capítulo
                const resChapter = await fetch(`/api/novels/${storyId}/chapters/${chapterId}`);
                if (!resChapter.ok) {
                    throw new Error('Error al cargar el capítulo.');
                }
                const dataChapter = await resChapter.json();
                setChapter(dataChapter);
                setLoading(false);

                // Verificar si 'novelTitle' está presente
                if (dataChapter.novelTitle) {
                    setNovelName(dataChapter.novelTitle);
                } else {
                    // Si no está presente, solicitar los datos de la novela
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

        // Añadir eventos para detectar selección de texto
        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('keyup', handleSelection);
        document.addEventListener('touchend', handleSelection); // Soporte para dispositivos táctiles

        // Limpiar eventos al desmontar el componente
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

        // Añadir event listeners al documento completo
        document.addEventListener('copy', handleCopy);
        document.addEventListener('cut', handleCut);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            // Limpiar event listeners al desmontar el componente
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('cut', handleCut);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // useEffect para desplazar al inicio al cambiar de capítulo
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Opcional: para un desplazamiento suave
        });
    }, [storyId, chapterId]);
    

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const totalHeight = scrollHeight - clientHeight;
        const scrolled = (scrollTop / totalHeight) * 100;
        setProgress(scrolled);
    };

    const handleFontSizeChange = (size) => {
        const newSize = Number(size);
        setFontSize(newSize);
        localStorage.setItem('fontSize', newSize);
    };

    const handleBrightnessChange = (value) => {
        const newBrightness = Number(value);
        setBrightness(newBrightness);
        localStorage.setItem('brightness', newBrightness);
    };

    const handleFontColorChange = (color) => {
        setFontColor(color);
        localStorage.setItem('fontColor', color);
    };

    const handleGeneralCommentSubmit = () => {
        if (generalComment.trim()) {
            setGeneralComments((prev) => [...prev, generalComment]);
            setGeneralComment('');
        }
    };

    // Función para renderizar Popover
    const renderPopover = (annotation) => (
        <Popover id={`popover-${popoverIdRef.current++}`}>
            <Popover.Header as="h3">Anotación</Popover.Header>
            <Popover.Body>{annotation}</Popover.Body>
        </Popover>
    );

    // Configuración de DOMPurify para permitir 'data-annotation' y la clase 'annotation'
    const sanitizeOptions = {
        ADD_ATTR: ['data-annotation', 'class', 'src', 'alt'],
    };

    // Parsear y envolver las anotaciones con OverlayTrigger y Popover
    const sanitizedContent = chapter ? DOMPurify.sanitize(chapter.content, sanitizeOptions) : '';

    const options = {
        replace: ({ name, attribs, children }) => {
            if (!attribs) return;
            if (name === 'span' && attribs.class === 'annotation') {
                const annotationText = decodeURIComponent(attribs['data-annotation']);
                return (
                    <OverlayTrigger
                        trigger="click"
                        placement="top"
                        overlay={renderPopover(annotationText)}
                        rootClose // Cierra el popover al hacer clic fuera
                    >
                        <span className="annotation">
                            {domToReact(children, options)}
                        </span>
                    </OverlayTrigger>
                );
            }
            if (name === 'img') {
                return <img src={attribs.src} alt={attribs.alt || 'Imagen'} style={{ maxWidth: '100%' }} />;
            }
            if (name === 'hr') {
                return <hr />;
            }
        },
    };

    // Función para manejar la descarga de la frase seleccionada
    const handleDownload = async () => {
        if (!selectedText) return;

        // Crear un elemento temporal con el diseño deseado
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.top = '50%';
        tempDiv.style.left = '50%';
        tempDiv.style.width = '800px'; // Ancho deseado
        tempDiv.style.height = '400px'; // Alto deseado
        tempDiv.style.transform = 'translate(-50%, -50%)';
        tempDiv.style.backgroundImage = `url(${backgroundImage})`;
        tempDiv.style.backgroundSize = 'cover';
        tempDiv.style.backgroundPosition = 'center';
        tempDiv.style.filter = 'blur(10px)'; // Aumentar el blur
        tempDiv.style.display = 'flex';
        tempDiv.style.flexDirection = 'column';
        tempDiv.style.justifyContent = 'center';
        tempDiv.style.alignItems = 'center';
        tempDiv.style.padding = '20px';
        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.color = '#FFD700'; // Texto dorado
        tempDiv.style.textAlign = 'center';
        tempDiv.style.fontSize = '28px';
        tempDiv.style.fontFamily = 'Cinzel, serif'; // Fuente más elegante y fantástica
        tempDiv.style.border = '3px solid #FFD700';
        tempDiv.style.borderRadius = '20px';
        tempDiv.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.7)';
        tempDiv.style.backgroundBlendMode = 'overlay';
        tempDiv.style.opacity = '0.95';

        // Crear el contenido de la imagen
        const contentDiv = document.createElement('div');
        contentDiv.style.background = 'rgba(0, 0, 0, 0.6)'; // Fondo semi-transparente para el texto
        contentDiv.style.padding = '20px';
        contentDiv.style.borderRadius = '15px';
        contentDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        contentDiv.style.width = '90%';

        const phraseElement = document.createElement('p');
        phraseElement.innerText = selectedText;
        phraseElement.style.fontSize = '32px';
        phraseElement.style.fontWeight = 'bold';
        phraseElement.style.marginBottom = '15px';
        phraseElement.style.fontStyle = 'italic';
        phraseElement.style.color = '#FFD700'; // Dorado

        const sourceElement = document.createElement('p');
        sourceElement.innerText = `- De la novela "${novelName}"`;
        sourceElement.style.fontSize = '24px';
        sourceElement.style.fontFamily = 'Lucida Console, Monaco, monospace'; // Fuente diferente para el origen
        sourceElement.style.opacity = '0.9'; // Texto más sutil
        sourceElement.style.color = '#FFD700'; // Dorado

        contentDiv.appendChild(phraseElement);
        contentDiv.appendChild(sourceElement);
        tempDiv.appendChild(contentDiv);
        document.body.appendChild(tempDiv);

        try {
            const canvas = await html2canvas(tempDiv, { useCORS: true });
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

    if (loading) return <p className="read-chapter-loading">Cargando...</p>;
    if (error) return <p className="read-chapter-error">{error}</p>;

    return (

        <div
            className="read-chapter"
            style={{
                '--brightness': `${brightness}%`,
                '--font-size': `${fontSize}px`,
                '--font-color': fontColor,
                userSelect: 'text',
                overflowY: 'auto',
                height: '100vh',
                position: 'relative',
            }}
            onScroll={handleScroll}
        >

            {/* Barra de progreso fija */}
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>

            <Container>
                {/* Título de la Novela */}
                <h1 className="story-title">{novelName}</h1>

                {/* Título del Capítulo */}
                <h2 className="chapter-title">{chapter.title}</h2>
                <p className="chapter-date">{new Date(chapter.publishedAt).toLocaleDateString()}</p>

                {/* Espacio para Anuncio 1: Antes del contenido del capítulo */}
                <section className="ad-section my-4">
                    <div className="ad-section-container">
                        <AdSense
                            adClient="ca-pub-3101266953328074"
                            adSlot="6455860659"
                            style={{ display: "block" }}
                        />
                    </div>
                </section>

                <div className="chapter-content">
                    {chapter && parse(sanitizedContent, options)}
                </div>

                {/* Espacio para Anuncio 2: Al final del contenido del capítulo */}
                <section className="ad-section my-4">
                    <div className="ad-section-container">
                        <AdSense
                            adClient="ca-pub-3101266953328074"
                            adSlot="5093282296"
                            style={{ display: "block" }}
                        />
                    </div>
                </section>
            </Container>

            {/* Botón de ajustes */}
            <div className="fixed-settings">
                <Button
                    variant="secondary"
                    className="settings-toggle"
                    onClick={() => setShowSettings((prev) => !prev)}
                >
                    <FaCog />
                </Button>
                {showSettings && (
                    <div className="settings-panel">
                        <Form.Group className="mb-3">
                            <Form.Label>Tamaño de Letra</Form.Label>
                            <Form.Range
                                min="12"
                                max="32"
                                value={fontSize}
                                onChange={(e) => handleFontSizeChange(e.target.value)}
                            />
                            <div className="text-end">{fontSize}px</div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Color de Fuente</Form.Label>
                            <Form.Select
                                value={fontColor}
                                onChange={(e) => handleFontColorChange(e.target.value)}
                            >
                                <option value="#FBFCFC">Blanco (#FBFCFC)</option>
                                <option value="#FFD700">Dorado (#FFD700)</option>
                                <option value="#A9DFBF">Verde Claro (#A9DFBF)</option>
                                <option value="#CDC3E3">Morado Claro (#CDC3E3)</option>
                                <option value="#FDEDEC">Rosado Claro (#FDEDEC)</option>
                                <option value="#FFFFFF">Blanco Puro (#FFFFFF)</option>
                                <option value="#FF5733">Naranja (#FF5733)</option>
                                <option value="#C70039">Rojo (#C70039)</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Brillo</Form.Label>
                            <Form.Range
                                min="50"
                                max="150"
                                value={brightness}
                                onChange={(e) => handleBrightnessChange(e.target.value)}
                            />
                            <div className="text-end">{brightness}%</div>
                        </Form.Group>

                    </div>
                )}
            </div>

            {/* Navegación entre capítulos */}
            <div className="chapter-navigation">
                <Button
                    variant="link"
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
                    onClick={() => navigate(`/story-detail/${storyId}`)}
                    className="nav-btn"
                >
                    <FaBook /> Contenido
                </Button>
                <Button
                    variant="link"
                    onClick={() => {
                        if (chapter.next) {
                            navigate(`/read-chapter/${storyId}/${chapter.next}`);
                        }
                    }}
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

            {/* Botón de Descarga de Frase */}
            {showDownloadButton && (
                <Button
                    variant="success"
                    className="fixed-download-button"
                    onClick={handleDownload}
                >
                    <FaQuoteRight /> Descargar Frase
                </Button>
            )}

            <ToastContainer position="bottom-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="warning">
                    <Toast.Header>
                        <strong className="me-auto">Aviso</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    ); // Cierre del bloque de retorno
};

export default ReadChapter;