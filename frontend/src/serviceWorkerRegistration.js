const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

function registerValidSW(swUrl) {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
            console.log('✅ Service Worker registrado con éxito:', registration);

            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker) {
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('♻️ Nueva versión disponible. Recargando...');
                                window.location.reload();
                            } else {
                                console.log('⚡ Contenido almacenado para uso offline.');
                            }
                        }
                    };
                }
            };
        })
        .catch((error) => {
            console.error('❌ Error al registrar el Service Worker:', error);
        });
}

export function register() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) {
        console.log('🌍 SW soportado. Intentando registrar...');

        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('✅ SW registrado con éxito:', registration);

                if (registration.installing) {
                    console.log('📦 SW instalándose...');
                } else if (registration.waiting) {
                    console.log('⏳ SW esperando para activarse...');
                } else if (registration.active) {
                    console.log('🚀 SW activo y funcionando.');
                }

                registration.onupdatefound = () => {
                    console.log('🔄 Nueva versión encontrada...');
                    const installingWorker = registration.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    console.log('♻️ Nueva versión lista. Recargando...');
                                    window.location.reload();
                                } else {
                                    console.log('⚡ SW listo para modo offline.');
                                }
                            }
                        };
                    }
                };
            })
            .catch(error => {
                console.error('❌ Error al registrar el SW:', error);
            });
    } else {
        console.warn('⚠️ SW no registrado. Requiere HTTPS o localhost.');
    }
}



export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
}
