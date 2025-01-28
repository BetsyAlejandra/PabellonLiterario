import React, { useEffect, useRef, useState } from 'react';

const DailymotionPlayer = ({ videoId }) => {
  const playerRef = useRef(null); // Referencia para el contenedor del reproductor
  const [isScriptLoaded, setIsScriptLoaded] = useState(false); // Estado para controlar la carga del script

  // Cargar el script de Dailymotion y inicializar el reproductor
  useEffect(() => {
    if (window.DM) {
      setIsScriptLoaded(true); // Si la API ya está cargada, actualizamos el estado
    } else {
      const script = document.createElement('script');
      script.src = 'https://api.dmcdn.net/all.js'; // Script de la API de Dailymotion
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true); // Cuando el script se haya cargado, actualizamos el estado
      };

      document.body.appendChild(script); // Añadir el script al cuerpo del documento

      return () => {
        document.body.removeChild(script); // Limpiar el script cuando el componente se desmonta
      };
    }
  }, []);

  // Inicializar el reproductor después de cargar el script
  useEffect(() => {
    if (isScriptLoaded && window.DM && playerRef.current) {
      const player = window.DM.player(playerRef.current, {
        video: videoId,
        width: '100%',
        height: '480px',
        params: {
          autoplay: 1, // Auto-reproducción
          controls: 1, // Mostrar controles
          mute: false,  // No silenciar el video
        },
      });
    }
  }, [isScriptLoaded, videoId]); // Ejecutar el efecto cada vez que el script esté cargado o el video cambie

  return <div ref={playerRef}></div>; // Div donde se insertará el reproductor
};

export default DailymotionPlayer;