// src/components/AdSense.jsx
import React, { useEffect, useRef } from 'react';

const AdSense = ({ adClient, adSlot, style = {}, format = 'auto', responsive = 'true' }) => {
    const adRef = useRef(null);
    const isAdPushed = useRef(false); // Para evitar inicializaciones duplicadas

    useEffect(() => {
        if (!isAdPushed.current && window.adsbygoogle && adRef.current) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isAdPushed.current = true; // Marca como inicializado
            } catch (e) {
                console.error('Error al inicializar AdSense:', e);
            }
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={style}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format={format}
            data-full-width-responsive={responsive}
            ref={adRef}
        ></ins>
    );
};

export default AdSense;