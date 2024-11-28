import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.css';

const StoryDetail = () => {
    const { id } = useParams(); // Captura el ID desde la URL
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchStory = async () => {
            console.log(`Solicitando novela con ID: ${id}`); // Log para verificar el ID
            try {
                const res = await axios.get(`https://pabellonliterario.com/api/novels/${id}`);
                setStory(res.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar la historia.');
                setLoading(false);
            }
        };
        fetchStory();
    }, [id]);


    const handleSaveStory = () => {
        // Aquí puedes implementar la lógica para guardar la historia en la biblioteca del usuario
        setSaved(true);
        alert('Historia guardada en tu biblioteca.');
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container my-5">
            <div className="card shadow-sm p-4 text-center">
                <div className="story-image-container">
                    <img
                        src={story.coverImage}
                        alt={`Portada de ${story.title}`}
                        className="story-image"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </div>
                <div className="mt-4">
                    <h2 className="story-title">{story.title}</h2>
                    <p className="story-description">{story.description}</p>
                    <div className="mt-3">
                        <strong>Géneros:</strong> {story.genres.join(', ')}
                    </div>
                    <div>
                        <strong>Etiquetas:</strong>{' '}
                        {story.tags.length > 0 ? story.tags.join(', ') : 'Sin etiquetas'}
                    </div>
                    <div>
                        <strong>Clasificación:</strong>{' '}
                        <span className="badge bg-secondary">{story.classification}</span>
                    </div>
                    <button
                        className={`btn mt-4 ${saved ? 'btn-success' : 'btn-outline-light'}`}
                        onClick={handleSaveStory}
                        disabled={saved}
                    >
                        {saved ? 'Guardado' : 'Guardar en Biblioteca'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryDetail;
