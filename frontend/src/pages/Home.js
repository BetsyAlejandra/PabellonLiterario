import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/global.css';
import marcadeagua from '../assets/Marca de Agua2.png';

const Home = () => {
  const [novels, setNovels] = useState([]); // Estado para almacenar las novelas
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
  const [latestNovels, setLatestNovels] = useState([]); // Estado para las últimas traducciones

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch('https://pabellonliterario.com/api/novels');
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Respuesta no es JSON');
        }
        const data = await response.json();
        setNovels(data);
        setLoading(false);
      } catch (error) {
        console.error('Error en fetchNovels:', error.message);
      }
    };

    const fetchLatestNovels = async () => {
      try {
        const response = await fetch('https://pabellonliterario.com/api/novels/latest');
        if (!response.ok) throw new Error('Error al obtener últimas novelas');
        const data = await response.json();
        setLatestNovels(data); // Actualiza el estado
      } catch (error) {
        console.error('Error en fetchLatestNovels:', error.message);
      }
    };

    fetchNovels();
    fetchLatestNovels(); // Llama a ambas funciones al montar el componente
  }, []);

  return (
    <div className="home-page">
      {/* Sección de Marca de Agua con el botón ¡Únete! */}
      <section className="watermark-section">
        <div className="watermark-overlay text-center">
          <img src={marcadeagua} alt="Marca de agua" className="watermark-logo" />
          <Button variant="primary" className="join-button">¡ÚNETE!</Button>
          <div className="join-button-text">
            <p>Únete a nuestra comunidad para más sorpresas.</p>
          </div>
        </div>
      </section>

      {/* Galería de Portadas de Obras Traducidas */}
      <section className="translated-works-gallery">
        <Container>
          <h2 className="text-center text-light">Galería de Obras Traducidas</h2>
          {loading ? (
            <p className="text-center text-light">Cargando novelas...</p>
          ) : (
            <Carousel>
              {novels.map((novel, index) => {
                return (
                  <Carousel.Item key={index}>
                    <Card className="text-center bg-dark text-light border-0">
                      <Card.Img
                        variant="top"
                        src={novel.coverImage}
                        className="carousel-image"
                        alt={`Cover image for ${novel.title}`}
                      />
                      <Card.Body>
                        <Card.Title>{novel.title}</Card.Title>
                        <Button as={Link} variant="outline-light" to={`/detalle/${novel._id}`}>
                          Ver más
                        </Button>
                      </Card.Body>
                    </Card>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          )}
        </Container>
      </section>

      <section className="latest-translations-and-support mt-5">
        <Container>
          <Row>
            <Col md={6} className="latest-translations">
              <h2 className="text-light">Últimas Traducciones</h2>
              <Row>
                {latestNovels.length === 0 ? (
                  <p className="text-light">No hay traducciones recientes.</p>
                ) : (
                  latestNovels.map(novel => (
                    <Col key={novel._id} className="mb-4">
                      <Card className="bg-dark text-light border-light position-relative">
                        <Card.Img
                          variant="top"
                          src={novel.coverImage}
                          alt={`Cover image for ${novel.title}`}
                          className="card-img"
                        />
                        <div className="overlay">
                          <Card.Body>
                            <Card.Title>{novel.title}</Card.Title>
                            <Card.Text>{novel.genre}</Card.Text>
                            <Button as={Link} variant="outline-light" to={`/detalle/${novel._id}`}>
                              Ver más
                            </Button>
                          </Card.Body>
                        </div>
                      </Card>
                    </Col>
                  ))
                )}
              </Row>
            </Col>
            <Col md={6} className="support-section text-light">
              {/* Apoyo y Discord */}
              <h2>¡Apóyanos!</h2>
              <p>Si te gustan nuestras traducciones y quieres ayudarnos a seguir, puedes hacerlo con una pequeña donación en nuestro perfil de Ko-fi.</p>
              <Button href="https://ko-fi.com/betsyalejandra" target="_blank" variant="outline-light">¡Apóyanos en Ko-fi!</Button>
              <h2 className="mt-4">¡Únete a Nuestro Discord!</h2>
              <p>Únete a nuestra comunidad para compartir tus opiniones, recomendaciones y más. ¡Estamos esperándote!</p>
              <Button href="https://discord.gg/Bw9NQ9xxZf" target="_blank" variant="outline-light">¡Únete al Discord!</Button>
            </Col>
          </Row>
        </Container>
      </section>


      {/* Traducción Destacada del Mes */}
      <section className="featured-translation py-5">
        <Container>
          <h2 className="text-center text-light">Traducción Destacada del Mes</h2>
          <Row className="align-items-center">
            <Col md={6}>
              <img src="https://via.placeholder.com/500x300" alt="Traducción Destacada" className="img-fluid rounded" />
            </Col>
            <Col md={6} className="text-light">
              <h3>Libro: Título Destacado</h3>
              <p>Descripción detallada de esta traducción destacada del mes.</p>
              <Button variant="outline-light" href="/leer">Leer ahora</Button>
              <Button variant="outline-secondary ms-2" href="/detalle">Más detalles</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Traductora del Mes */}
      <section className="translator-of-the-month py-5">
        <Container>
          <h2 className="text-center text-light">Traductora del Mes</h2>
          <Row className="align-items-center">
            <Col md={4} className="text-center">
              <img src="https://via.placeholder.com/150" alt="Traductora del Mes" className="rounded-circle img-fluid" />
            </Col>
            <Col md={8} className="text-light">
              <h3>Nombre de la Traductora</h3>
              <p>Este mes, destacamos a nuestra traductora del mes. Ella ha realizado contribuciones excepcionales a nuestra comunidad de traducción.</p>
              <Button variant="outline-light">Ver perfil</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Historia y Logros */}
      <section className="history-and-achievements py-5">
        <Container>
          <h2 className="text-center text-light">Historia y Logros</h2>
          <Row>
            <Col md={12}>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-icon">📅</div>
                  <div className="timeline-content">
                    <h5>2020</h5>
                    <p>Primera traducción completada con éxito.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">📅</div>
                  <div className="timeline-content">
                    <h5>2021</h5>
                    <p>Alcanzamos 500 miembros en nuestra comunidad de Discord.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">📅</div>
                  <div className="timeline-content">
                    <h5>2022</h5>
                    <p>Más de 1,000 reseñas positivas de nuestros seguidores.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">📅</div>
                  <div className="timeline-content">
                    <h5>2023</h5>
                    <p>Más de 50K lectores en todo el mundo.</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
