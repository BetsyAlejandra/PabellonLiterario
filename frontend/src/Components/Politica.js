import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';

const PoliticaPrivacidad = () => {
  return (
    <div className="bg-light" style={{ background: '#E8E2D6', minHeight: '100vh', paddingTop: '40px' }}>
      <Helmet>
        <title>Política de Privacidad | Pabellón Literario</title>
        <meta name="description" content="Consulta nuestra política de privacidad para saber cómo manejamos tu información personal." />
      </Helmet>
      <Container>
        <h1 className="text-center text-uppercase" style={{ color: '#D6B4A1', marginBottom: '30px' }}>
          Política de Privacidad
        </h1>
        <div className="text-justify" style={{ lineHeight: '1.8', color: '#5A4A42' }}>
          <p>En Pabellón Literario, la privacidad de nuestros usuarios es fundamental. A continuación, detallamos cómo manejamos tu información personal:</p>

          <h3 className="mt-4">1. Información Recopilada</h3>
          <p>No recopilamos información personal sin el consentimiento explícito del usuario. La información proporcionada en formularios de contacto o postulaciones se usa exclusivamente para los fines indicados.</p>

          <h3 className="mt-4">2. Uso de la Información</h3>
          <p>La información que recopilamos se usa para mejorar la experiencia de los usuarios, responder a consultas y gestionar las postulaciones de colaboradores.</p>

          <h3 className="mt-4">3. Servicios de Terceros</h3>
          <p>Utilizamos Google Analytics para recopilar información anónima sobre el tráfico del sitio con el fin de mejorar nuestros servicios. Puedes consultar cómo Google recopila y procesa los datos en la <a href="https://policies.google.com/privacy" target="_blank" className="text-decoration-none" style={{ color: '#D6B4A1' }}>Política de Privacidad de Google</a>.</p>

          <h3 className="mt-4">4. Publicidad</h3>
          <p>Google AdSense se utiliza para mostrar anuncios personalizados. Puedes gestionar la personalización de anuncios a través de la <a href="https://adssettings.google.com/" target="_blank" className="text-decoration-none" style={{ color: '#D6B4A1' }}>Configuración de Anuncios de Google</a>.</p>

          <h3 className="mt-4">5. Compartición de Datos</h3>
          <p>No compartimos datos con terceros bajo ninguna circunstancia, excepto cuando lo exija la ley.</p>

          <h3 className="mt-4">6. Seguridad</h3>
          <p>Tomamos medidas para proteger la información personal almacenada en nuestra plataforma, aunque no podemos garantizar la seguridad absoluta de los datos transmitidos por internet.</p>

          <h3 className="mt-4">7. Cookies</h3>
          <p>Utilizamos cookies para mejorar la navegación y personalizar anuncios. Puedes gestionar las cookies desde la configuración de tu navegador.</p>

          <h3 className="mt-4">8. Modificaciones</h3>
          <p>Nos reservamos el derecho de modificar esta política en cualquier momento. Las actualizaciones se publicarán en esta página.</p>

          <h3 className="mt-4">9. Contacto</h3>
          <p>Si tienes alguna pregunta sobre nuestra política de privacidad, puedes contactarnos a través del <a href="/contactanos" className="text-decoration-none" style={{ color: '#D6B4A1' }}>formulario de contacto</a> o nuestro servidor de Discord.</p>
        </div>
      </Container>
    </div>
  );
};

export default PoliticaPrivacidad;