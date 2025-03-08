import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';

const TerminosServicios = () => {
  return (
    <div style={{ background: '#D3D0E1', minHeight: '100vh', padding: '40px' }}>
      <Helmet>
        <title>Términos de Servicio | Pabellón Literario</title>
        <meta name="description" content="Consulta los términos de uso de Pabellón Literario antes de utilizar la plataforma." />
      </Helmet>

      <Container className="text-center">
        <h1 className="mb-4 text-uppercase" style={{ color: '#D6B4A1' }}>
          Términos de Servicio
        </h1>

        <div className="text-start" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', color: '#5A4A42' }}>
          <p>
            Al utilizar Pabellón Literario, aceptas los siguientes términos y condiciones:
          </p>

          <hr />

          <h3>1. Uso de la Plataforma</h3>
          <p>
            El contenido compartido en Pabellón Literario es únicamente con fines de entretenimiento y sin fines de lucro. La redistribución de las traducciones, especialmente en formato PDF, está estrictamente prohibida.
          </p>

          <hr />

          <h3>2. Contenido Subido por Usuarios</h3>
          <p>
            Los usuarios que deseen colaborar con traducciones o contenido original deberán contar con los permisos necesarios. Todo contenido pasará por una revisión de edición antes de publicarse.
          </p>

          <hr />

          <h3>3. Donaciones</h3>
          <p>
            Las donaciones recibidas a través de Ko-fi, PayPal o Patreon son destinadas exclusivamente para cubrir los costos de hosting y base de datos de la página, y no para la obtención de beneficios económicos.
          </p>

          <hr />

          <h3>4. Derechos de Autor</h3>
          <p>
            Pabellón Literario no se hace responsable de posibles reclamaciones de derechos de autor sobre las traducciones alojadas. Cualquier solicitud de eliminación puede realizarse a través del formulario de contacto o nuestro servidor de Discord.
          </p>

          <hr />

          <h3>5. Modificaciones</h3>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento, por lo que recomendamos revisarlos periódicamente.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default TerminosServicios;