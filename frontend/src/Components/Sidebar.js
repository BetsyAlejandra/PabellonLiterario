import React, { useState } from 'react';
import '../styles/components.css';

const Sidebar = ({ totalContent, currentContent, onFontSizeChange, onBrightnessChange }) => {
    const [fontSize, setFontSize] = useState(16); // Tamaño de la fuente por defecto
    const [brightness, setBrightness] = useState(100); // Brillo por defecto

    const handleFontSizeChange = (e) => {
        setFontSize(e.target.value);
        onFontSizeChange(e.target.value);
    };

    const handleBrightnessChange = (e) => {
        setBrightness(e.target.value);
        onBrightnessChange(e.target.value);
    };

    const readingProgress = ((currentContent / totalContent) * 100).toFixed(2);

    return (
        <div className="sidebar">
            <div className="progress">
                <strong>Progreso: </strong>
                <span>{readingProgress}%</span>
            </div>

            <div className="font-size">
                <label htmlFor="font-size-slider">Tamaño de fuente: </label>
                <input
                    type="range"
                    id="font-size-slider"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                />
                <span>{fontSize}px</span>
            </div>

            <div className="brightness">
                <label htmlFor="brightness-slider">Brillo: </label>
                <input
                    type="range"
                    id="brightness-slider"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={handleBrightnessChange}
                />
                <span>{brightness}%</span>
            </div>
        </div>
    );
};

export default Sidebar;