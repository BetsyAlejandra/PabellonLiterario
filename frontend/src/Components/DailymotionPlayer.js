import React from 'react';

const DailymotionPlayer = ({ videoId }) => {
  return (
    <div>
      <iframe
        width="100%"  // Ajusta el tamaño al 100% del contenedor
        height="480"   // Ajusta la altura según lo que necesites
        src={`https://www.dailymotion.com/embed/video/${videoId}`}  // La URL del reproductor incrustado
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Dailymotion Video Player"
      />
    </div>
  );
};

export default DailymotionPlayer;