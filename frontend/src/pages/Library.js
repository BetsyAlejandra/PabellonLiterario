import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/global.css';

const Library = () => {
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const res = await axios.get('https://pabellonliterario.com/api/library'); // Endpoint para la biblioteca
                setLibrary(res.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar la biblioteca.');
                setLoading(false);
            }
        };
        fetchLibrary();
    }, []);

    if (loading) return <p>Cargando biblioteca...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container my-5">
            <h2>Mi Biblioteca</h2>
            <div className="list-group mt-4">
                {library.map((item) => (
                    <div key={item.id} className="list-group-item">
                        <div className="d-flex align-items-center">
                            <img
                                src={item.coverImage}
                                alt={`Portada de ${item.title}`}
                                style={{ width: '100px', height: '150px', objectFit: 'cover', marginRight: '20px' }}
                                className="story-image"
                            />
                            <div className="flex-grow-1">
                                <h5 className="mb-2">{item.title}</h5>
                                <p>Progreso: {item.progress} / {item.chaptersAvailable} capítulos</p>
                                <div>
                                    <strong>Capítulos disponibles:</strong>
                                    <ul>
                                        {item.chapters.map((chapter, index) => (
                                            <li key={index}>{chapter}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;