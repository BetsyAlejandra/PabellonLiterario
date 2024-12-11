import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Annotation from '../extensions/Annotation'; // Asegúrate de que la ruta sea correcta
import { Modal, Button } from 'react-bootstrap';
import '../styles/EditChapter.css'; // Importa el archivo CSS específico

const EditChapter = () => {
    const { storyId, chapterId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [annotationText, setAnnotationText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnnotationButton, setShowAnnotationButton] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Italic,
            Underline,
            Link,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Image,
            HorizontalRule,
            Annotation, // Añade la extensión de anotación aquí
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

        // Utiliza el comando definido en la extensión para establecer una anotación
        editor.chain().focus().setAnnotation({ text: annotationText }).run();

        setSelectedText('');
        setAnnotationText('');
        setModalShow(false);
        setShowAnnotationButton(false);
    };

    // Función para insertar una imagen
    const insertImage = () => {
        const url = prompt("Ingrese la URL de la imagen:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    // Función para insertar un separador de texto
    const insertSeparator = () => {
        editor.chain().focus().setHorizontalRule().run();
    };

    if (loading) return <p className="text-center edit-chapter-loading">Cargando datos del capítulo...</p>;
    if (error) return <p className="text-center text-danger edit-chapter-error">{error}</p>;

    return (
        <div className="edit-chapter-container">
            <h2 className="edit-chapter-title">Editar Capítulo</h2>

            <div className="edit-chapter-card">
                <div className="edit-chapter-card-body">
                    <div className="form-group mb-3">
                        <label htmlFor="title" className="edit-chapter-label">Título del Capítulo</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control edit-chapter-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Introduce el título del capítulo"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="content" className="edit-chapter-label">Contenido del Capítulo</label>
                        {/* Barra de herramientas */}
                        <div className="toolbar mb-2 edit-chapter-toolbar">
                            <button
                                className="btn btn-tool edit-chapter-btn"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                disabled={!editor}
                                title="Negrita"
                            >
                                <b>B</b>
                            </button>
                            <button
                                className="btn btn-tool edit-chapter-btn"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                disabled={!editor}
                                title="Cursiva"
                            >
                                <i>I</i>
                            </button>
                            <button
                                className="btn btn-tool edit-chapter-btn"
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                disabled={!editor}
                                title="Subrayado"
                            >
                                <u>U</u>
                            </button>
                            <button
                                className="btn btn-tool edit-chapter-btn"
                                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                disabled={!editor}
                                title="Alinear Izquierda"
                            >
                                ↤
                            </button>
                            <button
                                className="btn btn-tool edit-chapter-btn"
                                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                disabled={!editor}
                                title="Alinear Centro"
                            >
                                ↔
                            </button>
                            <button
                                className="btn btn-tool edit-chapter-btn"
                                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                disabled={!editor}
                                title="Alinear Derecha"
                            >
                                ↦
                            </button>

                            <button
                                className="btn btn-tool edit-chapter-btn"
                                onClick={() => {
                                    const url = prompt("Ingrese la URL del enlace:");
                                    if (url) {
                                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                                    }
                                }}
                                disabled={!editor}
                                title="Insertar Enlace"
                            >
                                🌐
                            </button>

                            {/* Botón para insertar imagen */}
                            <button
                                className="btn btn-tool edit-chapter-btn"
                                onClick={insertImage}
                                disabled={!editor}
                                title="Insertar Imagen"
                            >
                                🖼️
                            </button>

                            {/* Botón para insertar separador */}
                            <button
                                className="btn btn-tool edit-chapter-btn"
                                onClick={insertSeparator}
                                disabled={!editor}
                                title="Insertar Separador"
                            >
                                ➖
                            </button>
                        </div>

                        <div className="editor-container edit-chapter-editor">
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    {error && <p className="text-danger edit-chapter-error">{error}</p>}

                    <div className="d-flex justify-content-center gap-3 edit-chapter-buttons">
                        <button
                            className="btn btn-primary edit-chapter-save-btn"
                            onClick={handleSaveChapter}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button
                            className="btn btn-secondary edit-chapter-cancel-btn"
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
                    className="floating-btn edit-chapter-floating-btn"
                    style={{
                        top: buttonPosition.top,
                        left: buttonPosition.left,
                        zIndex: 1000,
                    }}
                >
                    <button
                        className="btn btn-success edit-chapter-annotate-btn"
                        onClick={() => setModalShow(true)}
                    >
                        Anotar
                    </button>
                </div>
            )}

            {/* Modal para agregar significado */}
            <Modal show={modalShow} onHide={() => setModalShow(false)} centered className="edit-chapter-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Significado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Texto Seleccionado:</strong> {selectedText}
                    </p>
                    <textarea
                        className="form-control edit-chapter-textarea"
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