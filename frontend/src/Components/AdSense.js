import React, { useEffect, useRef } from 'react';

const AdSense = ({ adClient, adSlot, style = {}, format = 'auto', responsive = 'true' }) => {
    const adRef = useRef(null);

    useEffect(() => {
        const loadAd = () => {
            if (window.adsbygoogle && adRef.current) {
                try {
                    window.adsbygoogle.push({});
                } catch (e) {
                    console.error('Error al inicializar AdSense:', e);
                }
            }
        };

        if (!window.adsbygoogle) {
            const script = document.createElement('script');
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            script.async = true;
            script.onload = loadAd;
            document.body.appendChild(script);
        } else {
            loadAd();
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block', ...style }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format={format}
            data-full-width-responsive={responsive}
            ref={adRef}
        ></ins>
    );
};

export default AdSense;