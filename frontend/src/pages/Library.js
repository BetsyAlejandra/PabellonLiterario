import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveLibrary, getLibrary, saveChapters, initDB, deleteOldDB } from '../utils/db';
import '../styles/Library.css'

const Library = () => {
    const [library, setLibrary] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                await deleteOldDB();
                const db = await initDB();
                console.log("📚 Base de datos inicializada:", db);

                const offlineLibrary = await getLibrary();
                if (offlineLibrary.length > 0) {
                    setLibrary(offlineLibrary);
                } else {
                    const res = await axios.get('/api/users/library', { withCredentials: true });
                    if (res.data && res.data.length > 0) {
                        setLibrary(res.data);
                        await saveLibrary(res.data);
                        console.log("✅ Biblioteca guardada en IndexedDB:", await getLibrary());

                        for (const novel of res.data) {
                            await fetchAndSaveChapters(novel._id);
                        }
                    }
                }
            } catch (error) {
                console.error("⚠️ Error al obtener la biblioteca:", error);
            }
        };

        fetchLibrary();
    }, []);



    const fetchAndSaveChapters = async (novelId) => {
        try {
            const res = await axios.get(`/api/novels/${novelId}/chapters`, { withCredentials: true });
            if (res.data) {
                await saveChapters(res.data);
            }
        } catch (error) {
            console.warn(`No se pudieron descargar los capítulos de la novela ${novelId}`);
        }
    };

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