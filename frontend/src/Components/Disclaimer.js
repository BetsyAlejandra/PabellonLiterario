import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';

const Disclaimer = () => {
  return (
    <div className="bg-light" style={{ background: '#F0E1D6', minHeight: '100vh', paddingTop: '40px' }}>
      <Helmet>
        <title>Disclaimer | Pabellón Literario</title>
        <meta name="description" content="Aviso legal sobre las traducciones en Pabellón Literario." />
      </Helmet>

      <Container className="text-center">
        <h1 className="text-uppercase mb-4" style={{ color: '#D6B4A1' }}>
          Disclaimer
        </h1>

        <div className="text-start" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: '#5A4A42' }}>
          <p>
            Pabellón Literario no posee derechos sobre las novelas originales. Las traducciones se realizan con fines de entretenimiento y sin ánimo de lucro.
          </p>
          <hr />
          <p>
            Las traducciones se realizan con el permiso de las traducciones en inglés, cuando se otorga, y no tienen fines comerciales.
          </p>
          <hr />
          <p>
            Si algún autor o propietario de derechos desea la eliminación de una obra, puede comunicarse con nosotros a través del formulario de contacto o nuestro servidor de Discord.
          </p>
          <hr />
          <p>
            El contenido de esta página está destinado solo para lectura online. Queda estrictamente prohibida la distribución en formato PDF o cualquier otro formato que permita su descarga.
          </p>
          <hr />
          <p>
            Pabellón Literario no se responsabiliza por el contenido original de las obras ni por posibles errores en las traducciones, los cuales pueden ser reportados para su corrección.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Disclaimer;