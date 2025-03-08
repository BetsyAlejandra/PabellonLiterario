import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';

const SobreNosotros = () => {
  return (
    <div className="bg-light" style={{ background: '#E8E2D6', minHeight: '100vh', paddingTop: '40px' }}>
      <Helmet>
        <title>Sobre Nosotros | Pabellón Literario</title>
        <meta name="description" content="Conoce más sobre el equipo detrás de Pabellón Literario y nuestra misión." />
      </Helmet>
      <Container>
        <motion.h1 
          className="text-center text-uppercase" 
          style={{ color: '#D6B4A1', marginBottom: '30px' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Sobre Nosotros
        </motion.h1>
        <motion.div 
          className="text-justify" 
          style={{ lineHeight: '1.8', color: '#5A4A42' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p>Pabellón Literario nació con la misión de compartir la literatura de diferentes partes del mundo, especialmente aquellas historias que no suelen tener traducción al español.</p>
          <p>Somos una comunidad que trabaja con pasión para acercar novelas de fantasía, danmei y otros géneros a los lectores de habla hispana.</p>

          <h3 className="mt-4">Nuestro Equipo</h3>
          <p>Conoce a nuestros <a href="/traductores" className="text-decoration-none" style={{ color: '#D6B4A1' }}>Traductores</a> y <a href="/editores" className="text-decoration-none" style={{ color: '#D6B4A1' }}>Editores</a>, quienes hacen posible cada traducción.</p>

          <h3 className="mt-4">Nuestra Historia</h3>
          <p>Descubre cómo hemos crecido con el paso del tiempo en nuestra <a href="/" className="text-decoration-none" style={{ color: '#D6B4A1' }}>Línea de Tiempo</a>.</p>

          <h3 className="mt-4">Nuestra Filosofía</h3>
          <p>Creemos en la colaboración, el respeto mutuo y la pasión por la literatura. Nuestro objetivo es ofrecer traducciones de calidad mientras respetamos a los autores originales.</p>

          <h3 className="mt-4">Cómo Puedes Contribuir</h3>
          <p>Si deseas formar parte de nuestro equipo, visita nuestra página de <a href="/postular" className="text-decoration-none" style={{ color: '#D6B4A1' }}>Postulación</a>.</p>
        </motion.div>
      </Container>
    </div>
  );
};

export default SobreNosotros;