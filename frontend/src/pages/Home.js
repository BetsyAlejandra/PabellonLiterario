import React from 'react';
import { Carousel, Container, Row, Col, Button, Card } from 'react-bootstrap';
import '../styles/global.css'; // Archivo CSS para personalización
import marcadeagua from '../assets/Marca de Agua2.png'; // Suponiendo que la marca de agua esté en la misma carpeta de assets

const Home = () => {
  return (
    <div className="home-page">
      {/* Sección de Marca de Agua con el botón ¡Únete! */}
      <section className="watermark-section">
        <div className="watermark-overlay">
          <img src={marcadeagua} alt="Marca de agua" className="watermark-logo" />
          <Button variant="primary" className="join-button">¡ÚNETE!</Button>
        </div>
      </section>

      {/* Carrusel de Traducciones Populares */}
      <section className="popular-translations">
        <Container>
          <h2>Traducciones Populares</h2>
          <Carousel>
            {/* Aquí irán las traducciones con más lecturas, con imagen y nombre */}
            <Carousel.Item>
              <img className="d-block w-100" src="https://via.placeholder.com/800x300" alt="Traducción 1" />
              <Carousel.Caption>
                <h3>Traducción Más Popular 1</h3>
                <p>Descripción corta de la traducción.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src="https://via.placeholder.com/800x300" alt="Traducción 2" />
              <Carousel.Caption>
                <h3>Traducción Más Popular 2</h3>
                <p>Descripción corta de la traducción.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src="https://via.placeholder.com/800x300" alt="Traducción 3" />
              <Carousel.Caption>
                <h3>Traducción Más Popular 3</h3>
                <p>Descripción corta de la traducción.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Container>
      </section>

      {/* Sección de Últimas Traducciones y Apoyo */}
      <section className="latest-translations-and-support">
  <Container>
    <Row>
      {/* Últimas Traducciones (A la izquierda) */}
      <Col md={6} className="latest-translations">
        <h2>Últimas Traducciones</h2>
        <Row>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Col md={12} key={index}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Traducción {item}</Card.Title>
                  <Card.Text>
                    Descripción corta de la traducción.
                  </Card.Text>
                  <footer className="text-muted">Hace 2 días</footer>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>

      {/* Sección de Apoyo, Discord y ¿Por qué unirte? (A la derecha) */}
      <Col md={6} className="support-section">
        <h2>¡Apóyanos!</h2>
        <p>Si te gustan nuestras traducciones y quieres ayudarnos a seguir, puedes hacerlo con una pequeña donación en nuestro perfil de Ko-fi.</p>
        <Button href="https://ko-fi.com/betsyalejandra" target="_blank" variant="outline-danger">
          ¡Apóyanos en Ko-fi!
        </Button>

        <h2 className="mt-4">¡Únete a Nuestro Discord!</h2>
        <p>Únete a nuestra comunidad para compartir tus opiniones, recomendaciones y más. ¡Estamos esperándote!</p>
        <Button href="https://discord.gg/Bw9NQ9xxZf" target="_blank" variant="outline-primary">
          ¡Únete al Discord!
        </Button>

        <h2 className="mt-4">¿Por qué unirte a nuestra comunidad?</h2>
        <p>Formar parte de nuestra comunidad tiene muchos beneficios. Obtén acceso a las traducciones más exclusivas, participa en nuestras encuestas, y más.</p>
        <Button variant="success">Descubre más</Button>
      </Col>
    </Row>
  </Container>
</section>
    </div>
  );
};

export default Home;
