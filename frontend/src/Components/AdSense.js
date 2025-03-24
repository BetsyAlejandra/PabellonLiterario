import React, { useEffect, useRef } from 'react';

const AdSense = ({ adClient, adSlot, style = {}, format = 'auto', responsive = 'true' }) => {
    const adRef = useRef(null);
    const hasLoaded = useRef(false); // Para evitar múltiples cargas

    useEffect(() => {
        if (!window.adsbygoogle) {
            const script = document.createElement('script');
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            script.async = true;
            document.body.appendChild(script);
            script.onload = () => {
                if (window.adsbygoogle && adRef.current) {
                    try {
                        window.adsbygoogle.push({});
                        hasLoaded.current = true; // Marcar como cargado
                    } catch (e) {
                        console.error('Error al inicializar AdSense:', e);
                    }
                }
            };
        } else if (adRef.current && !hasLoaded.current) {
            try {
                window.adsbygoogle.push({});
                hasLoaded.current = true; // Marcar como cargado
            } catch (e) {
                console.error('Error al inicializar AdSense:', e);
            }
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block', minWidth: '300px', minHeight: '250px', ...style }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format={format}
            data-full-width-responsive={responsive}
            ref={adRef}
        ></ins>
    );
};

export default AdSense;