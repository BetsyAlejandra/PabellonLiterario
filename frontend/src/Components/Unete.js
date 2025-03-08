import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';

const Unete = () => {
  return (
    <div className="bg-light" style={{ background: '#C9D6D5', minHeight: '100vh', paddingTop: '40px' }}>
      <Helmet>
        <title>Únete a Nosotros | Pabellón Literario</title>
        <meta name="description" content="Forma parte de Pabellón Literario y ayuda con las traducciones, edición o audiolibros." />
      </Helmet>

      <Container>
        <h1 className="text-center text-uppercase mb-4" style={{ color: '#D6B4A1' }}>
          Únete a Nosotros
        </h1>

        <div className="text-justify" style={{ color: '#5A4A42', lineHeight: '1.8' }}>
          <p>
            Pabellón Literario es una comunidad que busca ofrecer contenido de calidad para los lectores de habla hispana.
            Si tienes habilidades en traducción, edición o creación de audiolibros, ¡te invitamos a formar parte de nuestro equipo!
          </p>

          <h3 className="mt-4">¿Qué perfiles buscamos?</h3>
          <ul className="list-unstyled">
            <li>📌 Traductores de chino, coreano, inglés u otros idiomas.</li>
            <li>📌 Editores con experiencia en revisión y corrección de textos.</li>
            <li>📌 Personas con conocimientos de subtitulación para audio dramas.</li>
          </ul>

          <h3 className="mt-4">Beneficios de unirte</h3>
          <ul className="list-unstyled">
            <li>✨ Acceso anticipado a las traducciones.</li>
            <li>✨ Formar parte de una comunidad apasionada por la literatura.</li>
            <li>✨ Aparecer en los créditos de las obras en las que participas.</li>
          </ul>

          <h3 className="mt-4">¿Cómo postular?</h3>
          <p>
            Puedes postularte llenando el formulario correspondiente para{' '}
            <a href="/postular" className="text-decoration-none" style={{ color: '#D6B4A1' }}>
              traducción
            </a>{' '}
            o{' '}
            <a href="/postular" className="text-decoration-none" style={{ color: '#D6B4A1' }}>
              edición
            </a>.
            Nos pondremos en contacto contigo lo antes posible.
          </p>

          <p className="text-center mt-4">
            ¡Te esperamos para ser parte de Pabellón Literario!
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Unete;