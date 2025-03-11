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
  const [latestChapters, setLatestChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch('/api/novels');
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Respuesta no es JSON');
        }

        const data = await response.json();

        if (Array.isArray(data.novels)) {
          setNovels(data.novels.slice(0, 20));
        } else {
          throw new Error('Respuesta inesperada: no es un arreglo');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error en fetchNovels:', error.message);
        setError(error.message);
        setNovels([]);
        setLoading(false);
      }
    };

    const fetchLatestChapters = async () => {
      try {
        const response = await fetch('/api/novels');
        const data = await response.json();

        if (!data.novels) return;

        let allChapters = data.novels.flatMap(novel =>
          novel.chapters.map(chap => ({
            ...chap,
            novelTitle: novel.title,
            novelId: novel._id,
          }))
        );

        allChapters.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        const latestChapters = allChapters.slice(0, 10);

        setLatestChapters(latestChapters);
      } catch (error) {
        console.error('Error al obtener los últimos capítulos:', error);
      }
    };

    const fetchLatestNovels = async () => {
      try {
        const response = await fetch('/api/novels/latest');
        if (!response.ok) throw new Error('Error al obtener últimas novelas');
        const data = await response.json();
        setLatestNovels(data);
      } catch (error) {
        console.error('Error en fetchLatestNovels:', error.message);
        setError(error.message);
        setLatestNovels([]);
      }
    };

    fetchNovels();
    fetchLatestChapters();
    fetchLatestNovels();
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
            <Slider {...settings} className="carousel-slider">
              {novels.map(novel => (
                <Card key={novel._id} className="gallery-card mx-2">
                  <div className="thumbnail-container">
                    <Card.Img variant="top" src={novel.coverImage} alt={novel.title} loading="lazy" className="thumbnail-image" />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title>{novel.title.length > 30 ? `${novel.title.slice(0, 30)}...` : novel.title}</Card.Title>
                    <Button as={Link} to={`/story-detail/${novel._id}`}>Ver más</Button>
                  </Card.Body>
                </Card>
              ))}
            </Slider>
          )}
        </Container>
      </section>

      <section className="latest-chapters container my-5">
        <h2 className="text-center section-title">📖 Últimos capítulos publicados</h2>
        <div className="chapters-wrapper">
          {latestChapters.map((chapter) => (
            <div key={chapter._id} className="chapter-card">
              <div className="card-content">
                <h5 className="chapter-title">{chapter.title}</h5>
                <p className="novel-title">📚 <strong>{chapter.novelTitle}</strong></p>
                <p className="date">📅 {new Date(chapter.publishedAt).toLocaleDateString()}</p>
                <a href={`/read-chapter/${chapter.novelId}/${chapter._id}`} className="btn-read">
                  Leer capítulo →
                </a>
              </div>
            </div>
          ))}
        </div>
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