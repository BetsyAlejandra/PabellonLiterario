import React, { useEffect, useRef } from 'react';

const AdSense = ({ adClient, adSlot, style = {}, format = 'auto', responsive = 'true' }) => {
    const adRef = useRef(null);

    useEffect(() => {
        if (!window.adsbygoogle) {
            const script = document.createElement('script');
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            script.async = true;
            document.body.appendChild(script);
            script.onload = () => {
                if (window.adsbygoogle) {
                    try {
                        window.adsbygoogle.push({});
                    } catch (e) {
                        console.error('Error al inicializar AdSense:', e);
                    }
                }
            };
        } else {
            try {
                window.adsbygoogle.push({});
            } catch (e) {
                console.error('Error al inicializar AdSense:', e);
            }
        }
    }, []);
    
    useEffect(() => {
        setTimeout(() => {
            if (window.adsbygoogle && adRef.current && adRef.current.offsetWidth > 0) {
                try {
                    window.adsbygoogle.push({});
                } catch (e) {
                    console.error('Error al inicializar AdSense:', e);
                }
            }
        }, 1000); // Esperar 1 segundo antes de cargar el anuncio
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