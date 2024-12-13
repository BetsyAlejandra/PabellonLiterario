// src/components/ReadChapter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, OverlayTrigger, Popover } from 'react-bootstrap';
import { FaArrowLeft, FaBook, FaArrowRight, FaCog, FaDownload } from 'react-icons/fa'; // Añadir FaDownload
import DOMPurify from 'dompurify';
import parse, { domToReact } from 'html-react-parser';
import '../styles/readChapter.css';
import AdSense from '../Components/AdSense';
import html2canvas from 'html2canvas'; // Importar html2canvas
import backgroundImage from '../assets/background.png'; // Importar la imagen de fondo

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
    const [generalComment, setGeneralComment] = useState('');
    const [generalComments, setGeneralComments] = useState([]);
    const [fontColor, setFontColor] = useState("#FBFCFC");

    // Nuevos estados para la selección de texto y descarga de imagen
    const [selectedText, setSelectedText] = useState('');
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const [novelName, setNovelName] = useState('');

    // Referencia para el contenedor principal
    const readChapterRef = useRef(null);

    // Ref para generar IDs únicos para los Popovers
    const popoverIdRef = useRef(0);

    useEffect(() => {
        // Recuperar configuraciones desde localStorage al montar el componente
        const savedPosition = localStorage.getItem('settingsButtonPosition');
        if (savedPosition) {
            setButtonPosition(JSON.parse(savedPosition));
        }

        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            setFontSize(Number(savedFontSize));
        }

        const savedBrightness = localStorage.getItem('brightness');
        if (savedBrightness) {
            setBrightness(Number(savedBrightness));
        }

        const savedFontColor = localStorage.getItem('fontColor');
        if (savedFontColor) {
            setFontColor(savedFontColor);
        }
    }, []);

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
                // Suponiendo que 'data' contiene 'novelTitle'
                if (data.novelTitle) {
                    setNovelName(data.novelTitle);
                } else {
                    // Alternativamente, podrías obtener el nombre de la novela desde otro lugar
                    setNovelName('Nombre de la Novela');
                }
            } catch (err) {
                setError('Error al cargar el capítulo.');
                setLoading(false);
            }
        };
        fetchChapter();
    }, [storyId, chapterId]);

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection.toString().trim();
            if (text.length > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                setButtonPosition({ top: rect.top + scrollTop - 40, left: rect.left + scrollLeft });
                setSelectedText(text);
                setShowDownloadButton(true);
                // Suponiendo que 'chapter.novelTitle' contiene el nombre de la novela
                if (chapter && chapter.novelTitle) {
                    setNovelName(chapter.novelTitle);
                }
            } else {
                setShowDownloadButton(false);
            }
        };

        // Añadir event listeners para detectar la selección
        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('keyup', handleSelection);

        // Limpiar event listeners al desmontar el componente
        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('keyup', handleSelection);
        };
    }, [chapter]);

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
                ['c', 'C', 'v', 'V', 'x', 'X'].includes(e.key)
            ) {
                e.preventDefault();
                alert('Esta acción está deshabilitada en esta sección.');
            }
        };

        const readChapterElement = readChapterRef.current;

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

    // useEffect para desplazar al inicio al cambiar de capítulo
    useEffect(() => {
        if (readChapterRef.current) {
            readChapterRef.current.scrollTo({
                top: 0,
                behavior: 'smooth', // Opcional: para un desplazamiento suave
            });
        }
    }, [chapter]); // Dependencia basada en 'chapter' para asegurar que el contenido está cargado

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const totalHeight = scrollHeight - clientHeight;
        const scrolled = (scrollTop / totalHeight) * 100;
        setProgress(scrolled);
    };

    const handleFontSizeChange = (size) => {
        setFontSize(Number(size));
        localStorage.setItem('fontSize', size);
    };

    const handleBrightnessChange = (value) => {
        setBrightness(Number(value));
        localStorage.setItem('brightness', value);
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
    const sanitizedContent = DOMPurify.sanitize(chapter.content, sanitizeOptions);

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
        tempDiv.style.top = '0';
        tempDiv.style.left = '0';
        tempDiv.style.width = '800px'; // Ancho deseado
        tempDiv.style.height = '400px'; // Alto deseado
        tempDiv.style.backgroundImage = `url(${backgroundImage})`;
        tempDiv.style.backgroundSize = 'cover';
        tempDiv.style.backgroundPosition = 'center';
        tempDiv.style.filter = 'blur(8px)';
        tempDiv.style.display = 'flex';
        tempDiv.style.flexDirection = 'column';
        tempDiv.style.justifyContent = 'center';
        tempDiv.style.alignItems = 'center';
        tempDiv.style.padding = '20px';
        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.color = '#FFFFFF';
        tempDiv.style.textAlign = 'center';
        tempDiv.style.fontSize = '24px';
        tempDiv.style.fontFamily = 'Georgia, serif'; // Fuente más elegante
        tempDiv.style.border = '2px solid #FFD700';
        tempDiv.style.borderRadius = '15px';
        tempDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
        tempDiv.style.backgroundBlendMode = 'overlay';
        tempDiv.style.opacity = '0.95';

        // Crear el contenido de la imagen
        const contentDiv = document.createElement('div');
        contentDiv.style.background = 'rgba(44, 62, 80, 0.6)'; // Fondo semi-transparente para el texto
        contentDiv.style.padding = '20px';
        contentDiv.style.borderRadius = '10px';
        contentDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';

        const phraseElement = document.createElement('p');
        phraseElement.innerText = selectedText;
        phraseElement.style.fontSize = '28px';
        phraseElement.style.fontWeight = 'bold';
        phraseElement.style.marginBottom = '10px';
        phraseElement.style.fontStyle = 'italic'; // Texto en cursiva

        const sourceElement = document.createElement('p');
        sourceElement.innerText = `- De la novela "${novelName}"`;
        sourceElement.style.fontSize = '20px';
        sourceElement.style.fontFamily = 'Lucida Console, Monaco, monospace'; // Fuente diferente para el origen
        sourceElement.style.opacity = '0.8'; // Texto más sutil

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
        }

        // Eliminar el elemento temporal del DOM
        document.body.removeChild(tempDiv);
    };

    return (
        <div
            className="read-chapter"
            ref={readChapterRef}
            style={{
                filter: `brightness(${brightness}%)`,
                fontSize: `${fontSize}px`,
                color: fontColor,
                userSelect: 'text', // Permitir la selección de texto
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
                    {parse(sanitizedContent, options)}
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
                    style={{
                        position: 'absolute',
                        top: buttonPosition.top,
                        left: buttonPosition.left,
                        zIndex: 1000,
                        transform: 'translate(-50%, -50%)', // Centrar el botón
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                    }}
                    onClick={handleDownload}
                >
                    <FaDownload /> Descargar Frase
                </Button>
            )}
        </div>
    ); 
}; 

export default ReadChapter;
