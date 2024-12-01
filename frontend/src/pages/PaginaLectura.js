import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Components/Sidebar'; // Importa Sidebar
import '../styles/global.css';

const PaginaLectura = () => {
    const { novelId, chapterId } = useParams();
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contentRead, setContentRead] = useState(0); // Variable para contar el progreso de lectura
    const [fontSize, setFontSize] = useState(16); // Tamaño de la fuente inicial
    const [brightness, setBrightness] = useState(100); // Brillo inicial

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                const response = await axios.get(
                    `https://pabellonliterario.com/api/novels/${novelId}/chapters/${chapterId}`
                );
                setChapter(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el capítulo.');
                setLoading(false);
            }
        };

        fetchChapter();
    }, [novelId, chapterId]);

    const handleFontSizeChange = (newSize) => {
        setFontSize(newSize);
    };

    const handleBrightnessChange = (newBrightness) => {
        setBrightness(newBrightness);
    };

    const handleContentRead = (newReadCount) => {
        setContentRead(newReadCount); // Actualiza el contenido leído
    };

    if (loading) return <p>Cargando capítulo...</p>;
    if (error) return <p>{error}</p>;

    const readingProgress = ((contentRead / chapter.content.length) * 100).toFixed(2);

    return (
        <div
            className="reading-page container my-5"
            style={{ fontSize: `${fontSize}px`, filter: `brightness(${brightness}%)` }}
        >
            <div className="chapter-header text-center mb-4">
                <h2>{chapter.title}</h2>
                <p className="text-muted">Capítulo {chapter.number}</p>
            </div>
            <div className="chapter-content">
                <p>{chapter.content}</p>
            </div>

            <Sidebar
                totalContent={chapter.content.length}
                currentContent={contentRead}
                onFontSizeChange={handleFontSizeChange}
                onBrightnessChange={handleBrightnessChange}
            />
        </div>
    );
};

export default PaginaLectura;