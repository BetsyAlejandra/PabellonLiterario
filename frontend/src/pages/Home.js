import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/homeStyles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import headerImage from '../assets/Encabezado.png';

const Home = () => {
  const [novels, setNovels] = useState([]);
  const [latestNovels, setLatestNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la petición');
        const data = await response.json();
        setter(Array.isArray(data.novels) ? data.novels.slice(0, 10) : []);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      }
    };

    fetchData('/api/novels', setNovels);
    fetchData('/api/novels/latest', setLatestNovels);
    setLoading(false);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    lazyLoad: "ondemand",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } }
    ],
  };

  return (
    <div className="home-page">
      {/* Encabezado */}
      <header className="header-section" style={{ backgroundImage: `url(${headerImage})` }}>
        <Container className="text-center py-5">
          <h1>Pabellón Literario</h1>
          <p>Únete a nuestra comunidad para más sorpresas</p>
          <Button href="https://discord.gg/Np8prZDgwX" variant="light">¡ÚNETE!</Button>
        </Container>
      </header>

      {/* Galería de Obras Traducidas */}
      <section className="translated-works-gallery py-5">
        <Container>
          <h2 className="text-center mb-4">Galería de Obras Traducidas</h2>
          {loading ? <p className="text-center">Cargando...</p> : (
            <Slider {...settings}>
              {novels.map(novel => (
                <Card key={novel._id} className="gallery-card mx-2">
                  <Card.Img variant="top" src={novel.coverImage} alt={novel.title} loading="lazy" />
                  <Card.Body className="text-center">
                    <Card.Title>{novel.title}</Card.Title>
                    <Button as={Link} to={`/story-detail/${novel._id}`}>Ver más</Button>
                  </Card.Body>
                </Card>
              ))}
            </Slider>
          )}
        </Container>
      </section>

      {/* Últimas Traducciones */}
      <section className="latest-translations py-5 bg-dark">
        <Container>
          <h2 className="text-center mb-4">Últimas Traducciones</h2>
          <Row>
            {latestNovels.map(novel => (
              <Col key={novel._id} md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={novel.coverImage} alt={novel.title} loading="lazy" />
                  <Card.Body className="text-center">
                    <Card.Title>{novel.title}</Card.Title>
                    <Card.Text>{novel.genre}</Card.Text>
                    <Button as={Link} to={`/story-detail/${novel._id}`}>Leer más</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Soporte y Reclutamiento */}
      <section className="support-and-apply py-5">
        <Container>
          <Row>
            <Col md={6} className="text-center mb-4">
              <h2>¡Apóyanos!</h2>
              <p>Ayúdanos con una donación en Ko-fi.</p>
              <Button href="https://ko-fi.com/betsyalejandra" target="_blank" rel="noopener noreferrer">¡Apóyanos en Ko-fi!</Button>
            </Col>
            <Col md={6} className="text-center">
              <h2>¡Únete a Nuestro Equipo!</h2>
              <p>Buscamos traductores y editores. Postúlate aquí.</p>
              <Button as={Link} to="/postular">Postúlate</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Historia y Logros */}
      <section className="history-and-achievements py-5 bg-dark">
        <Container>
          <h2 className="text-center mb-4">Historia y Logros</h2>
          <Row>
            <Col md={12}>
              <div className="timeline">
                {[{ date: "21 Nov 2024", text: "Creación del servidor" },
                  { date: "25 Nov 2024", text: "Inicio de la programación" },
                  { date: "24 Nov 2024", text: "Primera reunión del equipo" },
                  { date: "3 Dic 2024", text: "Lanzamiento de la primera versión" }]
                  .map((event, index) => (
                    <div key={index} className="timeline-item d-flex align-items-center mb-3">
                      <div className="timeline-icon mr-3">📅</div>
                      <div>
                        <h5>{event.date}</h5>
                        <p>{event.text}</p>
                      </div>
                    </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;