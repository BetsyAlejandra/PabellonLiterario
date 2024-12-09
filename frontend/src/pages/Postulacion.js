import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../styles/Postulacion.css'; // Archivo CSS para los estilos

const Postulacion = () => {
  return (
    <div className="postulacion-page">
      {/* Encabezado con diseño llamativo */}
      <div className="postulacion-header">
        <h1 className="postulacion-title">Únete a Nuestro Equipo</h1>
        <p className="postulacion-subtitle">
          ¿Quieres ser parte de nuestro mágico Pabellón Literario? Postúlate como Traductor, Escritor o Editor y comparte tu talento con el mundo. 🎉
        </p>
      </div>

      {/* Contenido principal */}
      <Container className="postulacion-content">
        <Row className="justify-content-center">
          <Col md={6} className="text-center postulacion-info">
            <h2>¿Cómo funciona?</h2>
            <p>
              Para subir tus traducciones o escritos originales, necesitamos conocerte mejor. Completa el formulario correspondiente según tu rol:
            </p>
            <ul className="postulacion-steps">
              <li>Selecciona el rol al que deseas postularte.</li>
              <li>Llena el formulario con tus datos y responde las preguntas.</li>
              <li>Alguien de nuestro equipo se pondrá en contacto contigo a través de Discord.</li>
            </ul>
          </Col>
        </Row>

        <Row className="justify-content-center postulacion-roles">
          {/* Opción para Traductor o Escritor */}
          <Col md={4} className="text-center">
            <div className="postulacion-card">
              <h3>Traductor o Escritor</h3>
              <p>
                ¡Ayúdanos a dar vida a historias increíbles! Postúlate para traducir novelas o compartir tus escritos originales.
              </p>
              <Button
                href="https://forms.gle/fDnwtZc8SncRDuUn9"
                target="_blank"
                rel="noopener noreferrer"
                className="postulacion-btn"
              >
                Postularme
              </Button>
            </div>
          </Col>

          {/* Opción para Editor */}
          <Col md={4} className="text-center">
            <div className="postulacion-card">
              <h3>Editor</h3>
              <p>
                ¿Eres un maestro de las palabras? Únete a nosotros como editor y ayúdanos a perfeccionar nuestras historias.
              </p>
              <Button
                href="https://forms.gle/GkTHPsk4S9P4Cxej9"
                target="_blank"
                rel="noopener noreferrer"
                className="postulacion-btn"
              >
                Postularme
              </Button>
            </div>
          </Col>
        </Row>

        {/* Mensaje final */}
        <Row className="justify-content-center mt-5">
          <Col md={8} className="text-center postulacion-final">
            <p>
              ¡Esperamos contar contigo para seguir construyendo nuestro mundo literario mágico! Si tienes dudas, no dudes en contactarnos.
            </p>
            <p className="postulacion-discord">📞 Nuestro equipo se pondrá en contacto contigo a través de Discord.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Postulacion;