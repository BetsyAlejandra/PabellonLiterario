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
    const [rating, setRating] = useState(0);  // Estado para la puntuación
    const [review, setReview] = useState(''); // Estado para la reseña

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

    const handleSaveStory = async () => {
        try {
            const res = await axios.post('https://pabellonliterario.com/api/users/library', {
                novelId: id,
            });
            setSaved(true);
            alert('Historia guardada en tu biblioteca.');
        } catch (err) {
            alert('Error al guardar la historia.');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`https://pabellonliterario.com/api/novels/${id}/reviews`, {
                rating,
                comment: review,
            });
            alert('Reseña enviada exitosamente.');
            setReview('');
            setRating(0);
        } catch (err) {
            alert('Error al enviar la reseña.');
        }
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

                    {/* Puntuación */}
                    <div className="mt-5">
                        <h4>Puntuación:</h4>
                        <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${rating >= star ? 'filled' : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Reseña */}
                    <form onSubmit={handleReviewSubmit} className="mt-4">
                        <div className="mb-3">
                            <label htmlFor="review" className="form-label">
                                Deja una reseña:
                            </label>
                            <textarea
                                id="review"
                                className="form-control"
                                rows="4"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Escribe tu reseña aquí..."
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={!review}>
                            Enviar reseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StoryDetail;
