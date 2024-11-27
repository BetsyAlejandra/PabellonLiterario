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
                const res = await axios.get('http://localhost:5000/api/novels');
                setStories(res.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar las historias.');
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const handleEditClick = (id) => {
        navigate(`/update/${id}`); // Redirige a la página de edición
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/novels/${id}`);
            setStories(stories.filter((story) => story._id !== id)); // Elimina localmente
            alert('Historia eliminada exitosamente.');
        } catch (err) {
            alert('Error al eliminar la historia.');
        }
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
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyStories;