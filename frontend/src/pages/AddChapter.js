import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill'; // Editor de texto enriquecido
import 'react-quill/dist/quill.snow.css'; // Estilos de Quill
import '../styles/global.css';

const AddChapter = () => {
    const { id } = useParams(); // Captura el ID de la novela desde la URL
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleSaveChapter = async () => {
        if (!title || !content) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);
        try {
            const newChapter = {
                title,
                content,
                publishedAt: new Date(),
            };

            // Enviar la solicitud para agregar el capítulo a la novela
            await axios.post(
                `http://localhost:5000/api/novels/add-chapter/${id}`, 
                newChapter
            );            
            setLoading(false);
            navigate(`/story-detail/${id}`); // Redirige a la página de detalle de la novela
        } catch (err) {
            setError('Error al guardar el capítulo.');
            setLoading(false);
        }
    };

    // Opciones de módulos de Quill
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            [{ 'align': [] }],
            ['link', 'image'],
            ['blockquote', 'code-block'],
        ],
    };

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Agregar Capítulo</h2>

            <div className="card shadow-sm p-4">
                <div className="card-body">
                    <div className="form-group mb-3">
                        <label htmlFor="title">Título del Capítulo</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Introduce el título del capítulo"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="content">Contenido del Capítulo</label>
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            theme="snow"
                            placeholder="Escribe el contenido del capítulo..."
                        />
                    </div>

                    {error && <p className="text-danger">{error}</p>}

                    <div className="d-flex justify-content-center gap-3">
                        <button
                            className="btn btn-primary"
                            onClick={handleSaveChapter}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Capítulo'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/story-detail/${id}`)} // Regresar a la página de detalles
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddChapter;