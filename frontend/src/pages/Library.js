import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Library.css'; // Asegúrate de que el archivo CSS esté correctamente importado.

const Library = () => {
    const [library, setLibrary] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const res = await axios.get('/api/users/library', { withCredentials: true });
                setLibrary(res.data);
            } catch (error) {
                console.error('Error al obtener la biblioteca', error);
            }
        };
        fetchLibrary();
    }, []);

    return (
        <div className="library-container">
            <h2 className="library-title">Tu Biblioteca</h2>
            <div className="library-grid">
                {library.length > 0 ? (
                    library.map((story) => (
                        <div key={story._id} className="library-card">
                            <img
                                src={story.coverImage}
                                alt={story.title}
                                className="library-card-image"
                            />
                            <div className="library-card-content">
                                <h3 className="library-card-title">{story.title}</h3>
                                <p className="library-card-description">{story.description}</p>
                                <button
                                    className="library-card-button"
                                    onClick={() => navigate(`/story-detail/${story._id}`)}
                                >
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="library-empty">No tienes novelas guardadas en tu biblioteca.</p>
                )}
            </div>
        </div>
    );
};

export default Library;