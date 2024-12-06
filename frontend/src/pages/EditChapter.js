import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Modal, Button } from 'react-bootstrap';
import DOMPurify from 'dompurify';
import '../styles/global.css';

const EditChapter = () => {
    const { storyId, chapterId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [annotations, setAnnotations] = useState([]);
    const [selectedText, setSelectedText] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [annotationText, setAnnotationText] = useState('');
    const [loading, setLoading] = useState(true); // Inicialmente en true para cargar datos
    const [error, setError] = useState(null);
    const [showAnnotationButton, setShowAnnotationButton] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

    // Referencia para manejar el botón flotante
    const floatingButtonRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Italic,
            Underline,
            Link,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: '',
        editorProps: {
            handleDOMEvents: {
                mouseup: (view, event) => {
                    const { state } = view;
                    const { selection } = state;

                    if (!selection.empty) {
                        const selectedText = state.doc.textBetween(
                            selection.from,
                            selection.to
                        );
                        setSelectedText(selectedText);

                        const rect = event.target.getBoundingClientRect();
                        setButtonPosition({
                            top: rect.top + window.scrollY - 40,
                            left: rect.left + window.scrollX + 50,
                        });

                        setShowAnnotationButton(true);
                    } else {
                        setShowAnnotationButton(false);
                    }
                },
            },
        },
    });

    useEffect(() => {
        const fetchChapterDetails = async () => {
            try {
                const res = await axios.get(
                    `/api/novels/${storyId}/chapters/${chapterId}`
                );
                const chapter = res.data;
                setTitle(chapter.title);
                editor?.commands.setContent(chapter.content || '');
                setAnnotations(chapter.annotations || []);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error al cargar el capítulo.');
                setLoading(false);
            }
        };
        fetchChapterDetails();
    }, [storyId, chapterId, editor]);

    const handleSaveChapter = async () => {
        if (!title || !editor.getHTML()) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);
        const updatedChapter = {
            title,
            content: editor.getHTML(),
            annotations,
        };

        try {
            await axios.put(
                `/api/novels/${storyId}/chapters/${chapterId}`,
                updatedChapter
            );
            setLoading(false);
            alert('Capítulo actualizado exitosamente.');
            navigate(`/my-stories`);
        } catch (err) {
            setError('Error al actualizar el capítulo.');
            setLoading(false);
        }
    };

    const handleSaveAnnotation = () => {
        if (!selectedText || !annotationText) return;

        // Escapar el texto de la anotación
        const escapedAnnotationText = encodeURIComponent(annotationText);

        // Utilizar 'span' en lugar de 'button'
        const annotationHTML = `<span class="annotation" data-annotation="${escapedAnnotationText}" style="color: blue; text-decoration: underline; cursor: pointer;">${selectedText}</span>`;

        editor
            .chain()
            .focus()
            .deleteRange(editor.state.selection)
            .insertContent(annotationHTML)
            .run();

        const newAnnotation = {
            text: selectedText,
            meaning: annotationText,
        };
        setAnnotations([...annotations, newAnnotation]);

        setSelectedText('');
        setAnnotationText('');
        setModalShow(false);
        setShowAnnotationButton(false);
    };

    // Manejar clic fuera del botón flotante para cerrarlo
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                floatingButtonRef.current &&
                !floatingButtonRef.current.contains(event.target)
            ) {
                setShowAnnotationButton(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading) return <p className="text-center">Cargando datos del capítulo...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Editar Capítulo</h2>

            <div className="card shadow-sm p-4">
                <div className="card-body">
                    <div className="form-group mb-3">
                        <label htmlFor="title">Título del Capítulo</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Introduce el título del capítulo"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="content">Contenido del Capítulo</label>
                        <div className="toolbar mb-2">
                            <button
                                className="btn btn-tool"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                            >
                                <b>B</b>
                            </button>
                            <button
                                className="btn btn-tool"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                            >
                                <i>I</i>
                            </button>
                            <button
                                className="btn btn-tool"
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                            >
                                <u>U</u>
                            </button>
                            <button
                                className="btn btn-tool"
                                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            >
                                ↤
                            </button>
                            <button
                                className="btn btn-tool"
                                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            >
                                ↔
                            </button>
                            <button
                                className="btn btn-tool"
                                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            >
                                ↦
                            </button>
                            <button
                                className="btn btn-tool"
                                onClick={() => {
                                    const url = prompt("Ingrese la URL del enlace:");
                                    if (url) {
                                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                                    }
                                }}
                            >
                                🌐
                            </button>
                        </div>

                        <div className="editor-container border p-2 rounded">
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    {error && <p className="text-danger">{error}</p>}

                    <div className="d-flex justify-content-center gap-3">
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveChapter}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/my-stories`)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>

            {/* Botón flotante para anotaciones */}
            {showAnnotationButton && (
                <div
                    className="floating-btn"
                    style={{
                        position: 'absolute',
                        top: buttonPosition.top,
                        left: buttonPosition.left,
                        zIndex: 1000,
                    }}
                    ref={floatingButtonRef}
                >
                    <button
                        className="btn btn-success"
                        onClick={() => setModalShow(true)}
                    >
                        Anotar
                    </button>
                </div>
            )}

            {/* Modal para agregar significado */}
            <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Significado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Texto Seleccionado:</strong> {selectedText}
                    </p>
                    <textarea
                        className="form-control"
                        value={annotationText}
                        onChange={(e) => setAnnotationText(e.target.value)}
                        placeholder="Escribe el significado o anotación"
                    ></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSaveAnnotation}>
                        Guardar
                    </Button>
                    <Button variant="secondary" onClick={() => setModalShow(false)}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

};

export default EditChapter;