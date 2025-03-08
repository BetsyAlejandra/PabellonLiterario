import React from 'react';
import { Helmet } from 'react-helmet';
import { Container, Accordion } from 'react-bootstrap';

const Preguntas = () => {
  return (
    <div className="bg-light" style={{ background: '#F1E4D1', minHeight: '100vh', paddingTop: '40px' }}>
      <Helmet>
        <title>Preguntas Frecuentes | Pabellón Literario</title>
        <meta name="description" content="Resuelve tus dudas sobre Pabellón Literario, una plataforma para traducciones de novelas, audio dramas y manhwas." />
      </Helmet>

      <Container>
        <h1 className="text-center text-uppercase mb-4" style={{ color: '#D6B4A1' }}>
          Preguntas Frecuentes
        </h1>

        <Accordion flush>
          {[
            { question: '¿Qué es Pabellón Literario?', answer: 'Pabellón Literario es una plataforma sin fines de lucro donde se alojan traducciones al español de novelas, audio dramas subtitulados y manhwas (próximamente) de diferentes idiomas.' },
            { question: '¿Puedo subir mis propias traducciones?', answer: 'Sí, los usuarios pueden subir traducciones siempre y cuando tengan el rol para ello.' },
            { question: '¿Cobran por acceder al contenido?', answer: 'No, todo el contenido es gratuito, salvo algunos capítulos de audio dramas que serán de pago.' },
            { question: '¿Cómo puedo apoyar a la página?', answer: 'Actualmente solo aceptamos donaciones a través de Ko-fi, PayPal o Patreon. Las donaciones se destinan a cubrir los costos de hosting y base de datos.' },
            { question: '¿Cómo puedo contactar con el equipo?', answer: 'Puedes utilizar el formulario de contacto disponible en nuestra página web o unirte a nuestro servidor de Discord.' },
            { question: '¿Qué tipo de contenido se publica?', answer: 'Se publican traducciones de novelas, audio dramas y manhwas (próximamente), con un enfoque especial en novelas danmei.' },
            { question: '¿Cómo puedo reportar errores o enlaces rotos?', answer: 'Los errores pueden reportarse a través del formulario de contacto o por medio de nuestro servidor de Discord.' },
            { question: '¿El contenido tiene algún costo oculto?', answer: 'No, todo el contenido es gratuito, excepto algunos capítulos de audio dramas que serán de pago.' },
            { question: '¿Cómo garantizan la calidad de las traducciones?', answer: 'Las traducciones pasan por un proceso de edición antes de ser publicadas para asegurar la calidad.' },
            { question: '¿Puedo descargar las novelas o capítulos?', answer: 'No está permitido descargar las novelas o capítulos. La distribución en formato PDF u otros formatos está estrictamente prohibida.' }
          ].map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>{item.question}</Accordion.Header>
              <Accordion.Body>
                {item.answer}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </div>
  );
};

export default Preguntas;