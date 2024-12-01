import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const MyStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await axios.get('https://pabellonliterario.com/api/novels');
                setStories(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error al cargar las historias.');
                setLoading(false);
            }
        };
        fetchStories();
    }, []);
   

    const handleEditClick = (id) => {
        navigate(`/update/${id}`); // Redirige a la página de edición de la novela
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta historia?')) {
            try {
                await axios.delete(`https://pabellonliterario.com/api/novels/${id}`);
                setStories((prevStories) => prevStories.filter((story) => story._id !== id)); // Elimina localmente de forma segura
                alert('Historia eliminada exitosamente.');
            } catch (err) {
                alert('Error al eliminar la historia. Intenta nuevamente.');
                console.error(err); // Mostrar más detalles del error en consola
            }
        }
    };
   

    const handleAddChapter = (id) => {
        navigate(`/add-chapter/${id}`); // Redirige a la página de agregar capítulo
    };

    if (loading) return <p className="text-center">Cargando historias...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Mis Historias</h2>
            <div className="row">
                {stories.map((story) => (
                    <div key={story._id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card shadow-sm h-100">
                            <img
                                src={story.coverImage}
                                alt={`Portada de ${story.title}`}
                                className="card-img-top"
                                style={{
                                    maxHeight: '200px',
                                    objectFit: 'cover',
                                }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{story.title}</h5>
                                <p className="card-text">{story.description}</p>
                                <div className="mb-2">
                                    <strong>Géneros:</strong>{' '}
                                    <span className="text-primary">{story.genres.join(', ')}</span>
                                </div>
                                <div className="mb-2">
                                    <strong>Clasificación:</strong>{' '}
                                    <span className="badge bg-secondary">{story.classification}</span>
                                </div>
                                <div>
                                    <strong>Etiquetas:</strong>{' '}
                                    <span className="text-info">
                                        {story.tags.length > 0 ? story.tags.join(', ') : 'Sin etiquetas'}
                                    </span>
                                </div>

                                {/* Mostrar colaboradores */}
                                <div className="mt-2">
                                    <strong>Colaboradores:</strong>{' '}
                                    {story.collaborators.length > 0
                                        ? story.collaborators.map((collab, idx) => (
                                              <span key={idx}>{collab.name} ({collab.role})</span>
                                          ))
                                        : 'Sin colaboradores'}
                                </div>

                                {/* Mostrar capítulos */}
                                {story.chapters && story.chapters.length > 0 && (
                                    <div className="mt-3">
                                        <strong>Capítulos:</strong>
                                        <ul>
                                            {story.chapters.map((chapter, idx) => (
                                                <li key={idx}>
                                                    {chapter.title} - {new Date(chapter.publishedAt).toLocaleDateString()}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer d-flex justify-content-center gap-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleEditClick(story._id)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteClick(story._id)}
                                >
                                    Eliminar
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleAddChapter(story._id)}
                                >
                                    Agregar Capítulo
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyStories;