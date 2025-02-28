import React, { useState } from 'react';
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
import imageCompression from 'browser-image-compression';
import { Modal, Button } from 'react-bootstrap';
import '../styles/AddChapter.css'; // Importa el archivo CSS específico

const AddChapter = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [annotationText, setAnnotationText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAnnotationButton, setShowAnnotationButton] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const [imageModalShow, setImageModalShow] = useState(false);
    const [imageWidth, setImageWidth] = useState('300');
    const [currentImageNode, setCurrentImageNode] = useState(null);

    const CustomImage = Image.extend({
        addAttributes() {
            return {
                src: { default: null },
                width: {
                    default: "300",
                    renderHTML: (attributes) => ({
                        width: attributes.width,
                    }),
                },
                height: {
                    default: "auto",
                    renderHTML: (attributes) => ({
                        height: attributes.height,
                    }),
                },
            };
        },

        addNodeView() {
            return ({ node, HTMLAttributes, getPos, editor }) => {
                const img = document.createElement("img");
                img.src = node.attrs.src;
                img.style.width = node.attrs.width;
                img.style.height = node.attrs.height;

                img.onclick = () => {
                    setImageWidth(node.attrs.width);
                    setCurrentImageNode({ node, getPos });
                    setImageModalShow(true);
                };

                return img;
            };
        },
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Italic,
            Underline,
            Link,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'editable-image',
                },
            }),
            HorizontalRule,
            Annotation,
            CustomImage,
        ],
        content: "",
        editorProps: {
            handleDOMEvents: {
                mouseup: (view, event) => {
                    const selection = window.getSelection();
                    const selectedText = selection.toString().trim();

                    if (selectedText) {
                        const range = selection.getRangeAt(0);
                        const rect = range.getBoundingClientRect();

                        setSelectedText(selectedText);
                        setButtonPosition({
                            top: rect.top + window.scrollY - 40,
                            left: rect.left + window.scrollX + rect.width / 2,
                        });
                        setShowAnnotationButton(true);
                    } else {
                        setShowAnnotationButton(false);
                    }
                },
            },
        },
    });

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleSaveChapter = async () => {
        if (!title || !editor.getHTML()) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);
        const newChapter = {
            title,
            content: editor.getHTML(),
            publishedAt: new Date(),
        };

        try {
            await axios.post(`/api/novels/add-chapter/${id}`, newChapter);
            setLoading(false);
            navigate(`/my-stories`);
        } catch (err) {
            setError('Error al guardar el capítulo.');
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

    const handleImageSizeSave = () => {
        if (currentImageNode) {
            editor.commands.updateAttributes(currentImageNode.node.type.name, {
                width: imageWidth,
            });
        }
        setImageModalShow(false);
    };

    const insertImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const options = {
                maxSizeMB: 0.3, // Tamaño máximo (en MB)
                maxWidthOrHeight: 1024, // Máximo ancho o alto
                useWebWorker: true,
                initialQuality: 0.7, // Calidad inicial
            };

            try {
                const compressedFile = await imageCompression(file, options);
                const reader = new FileReader();

                reader.onload = () => {
                    const imageUrl = reader.result;
                    editor.chain().focus().setImage({ src: imageUrl }).run();
                };

                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error("Error al comprimir la imagen:", error);
            }
        }
    };


    const insertSeparator = () => {
        editor.chain().focus().setHorizontalRule().run();
    };

    return (
        <div className="add-chapter-container">
            <h2 className="add-chapter-title">Agregar Capítulo</h2>

            <div className="add-chapter-card">
                <div className="add-chapter-card-body">
                    <div className="form-group mb-3">
                        <label htmlFor="title" className="add-chapter-label">Título del Capítulo</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control add-chapter-input"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Introduce el título del capítulo"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="content" className="add-chapter-label">Contenido del Capítulo</label>
                        {/* Barra de herramientas */}
                        <div className="toolbar add-chapter-toolbar sticky-toolbar mb-2">
                            <button
                                className="btn btn-tool add-chapter-btn"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                disabled={!editor}
                                title="Negrita"
                            >
                                <b>B</b>
                            </button>
                            <button
                                className="btn btn-tool add-chapter-btn"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                disabled={!editor}
                                title="Cursiva"
                            >
                                <i>I</i>
                            </button>
                            <button
                                className="btn btn-tool add-chapter-btn"
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                disabled={!editor}
                                title="Subrayado"
                            >
                                <u>U</u>
                            </button>
                            <button
                                className="btn btn-tool add-chapter-btn"
                                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                disabled={!editor}
                                title="Alinear Izquierda"
                            >
                                ↤
                            </button>
                            <button
                                className="btn btn-tool add-chapter-btn"
                                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                disabled={!editor}
                                title="Alinear Centro"
                            >
                                ↔
                            </button>
                            <button
                                className="btn btn-tool add-chapter-btn"
                                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                disabled={!editor}
                                title="Alinear Derecha"
                            >
                                ↦
                            </button>

                            <button
                                className="btn btn-tool add-chapter-btn"
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
                            <label className="btn btn-tool add-chapter-btn" title="Insertar Imagen">
                                🖼️
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={insertImage}
                                />
                            </label>

                            {/* Botón para insertar separador */}
                            <button
                                className="btn btn-tool add-chapter-btn"
                                onClick={insertSeparator}
                                disabled={!editor}
                                title="Insertar Separador"
                            >
                                ➖
                            </button>

                            <button
                                className="btn btn-warning add-chapter-btn"
                                onClick={() => {
                                    const cleaned = editor.getHTML()
                                        .replace(/<br\s*\/?>/g, '')
                                        .replace(/\n/g, '');
                                    editor.commands.setContent(cleaned); // Actualiza el editor
                                }}
                            >
                                Limpiar Saltos de Texto
                            </button>

                        </div>

                        <div className="editor-container add-chapter-editor">
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    {error && <p className="text-danger add-chapter-error">{error}</p>}

                    <div className="fixed-bottom-buttons add-chapter-buttons d-flex justify-content-center gap-3">
                        <button
                            className="btn btn-primary add-chapter-save-btn"
                            onClick={handleSaveChapter}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Capítulo'}
                        </button>
                        <button
                            className="btn btn-secondary add-chapter-cancel-btn"
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
                    className={`floating-btn ${showAnnotationButton ? 'visible' : 'hidden'} add-chapter-floating-btn`}
                    style={{
                        top: buttonPosition.top,
                        left: buttonPosition.left,
                    }}
                >
                    <button
                        className="btn btn-success add-chapter-annotate-btn"
                        onClick={() => setModalShow(true)}
                    >
                        Anotar
                    </button>
                </div>

            )}

            {/* Modal para agregar significado */}
            <Modal show={modalShow} onHide={() => setModalShow(false)} centered className="add-chapter-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Significado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Texto Seleccionado:</strong> {selectedText}
                    </p>
                    <textarea
                        className="form-control add-chapter-textarea"
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

            <Modal show={imageModalShow} onHide={() => setImageModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Modificar Tamaño de Imagen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="number"
                        className="form-control"
                        value={imageWidth}
                        onChange={(e) => setImageWidth(e.target.value)}
                        placeholder="Introduce el ancho en píxeles"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleImageSizeSave}>Guardar</Button>
                    <Button variant="secondary" onClick={() => setImageModalShow(false)}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

};

export default AddChapter;