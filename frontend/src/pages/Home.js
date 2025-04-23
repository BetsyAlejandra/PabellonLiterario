import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/homeStyles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Calendar, BookOpen, ArrowRight } from "lucide-react";
import Slider from "react-slick";
import headerImage from '../assets/Encabezado.png';

const Home = () => {
  const [novels, setNovels] = useState([]);
  const [latestNovels, setLatestNovels] = useState([]);
  const [latestChapters, setLatestChapters] = useState(() => []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = headerImage;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await fetch('/api/novels/latest');
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Datos inválidos");

        setLatestNovels(data);
      } catch (error) {
        console.error("Error al obtener novelas:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [novelsRes, latestChaptersRes] = await Promise.all([
          fetch('/api/novels?page=1&limit=14'),
          fetch('/api/novels/latest-chapters')
        ]);

        if (!novelsRes.ok || !latestChaptersRes.ok) throw new Error("Error al cargar datos");

        const novelsData = await novelsRes.json();
        const latestChaptersData = await latestChaptersRes.json();

        setNovels(novelsData.novels || []);
        setLatestChapters(latestChaptersData.latestGroupedChapters || []);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Carga diferida para mejorar INP
    requestIdleCallback(fetchData);
  }, []);

  const novelsMemo = useMemo(() => novels, [novels]);

  const settings = useMemo(() => ({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: novelsMemo.length > 0 ? Math.min(novelsMemo.length, 8) : 1,
    slidesToScroll: 1,
    lazyLoad: "progressive",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } }
    ],
  }), [novelsMemo.length]);


  return (
    <div className="home-page">
      <header className="hero-section" style={{ background: "linear-gradient(45deg, #F1E4D1, #D3D0E1)" }}>
        <Container className="text-center text-light">
          <h1 className="hero-title display-3">Pabellón Literario</h1>
          <p className="hero-subtitle lead">Donde la literatura cobra vida</p>
          <Button href="https://discord.gg/hV2APBNYYS" variant="light" className="join-btn rounded-pill shadow-lg">¡ÚNETE!</Button>
        </Container>
      </header>



      <section className="translated-works-gallery py-5">
        <Container>
          <h2 className="text-center mb-4">Galería de Obras Traducidas</h2>
          {loading ? (
            <Row>
              {[...Array(8)].map((_, index) => (
                <Col key={index} md={3} sm={6} xs={12} className="mb-3">
                  <div className="skeleton-card rounded shadow-lg"></div>
                </Col>
              ))}
            </Row>
          ) : (
            novelsMemo.length > 0 ? (
              <Slider {...settings}>
                {novelsMemo.map(novel => (
                  <div key={novel._id} className="gallery-card-wrapper">
                    <Card className="gallery-card shadow-lg rounded">
                      <Card.Img
                        variant="top"
                        src={novel.coverImage}
                        alt={novel.title}
                        loading="lazy"
                        width="200"
                        height="300"
                        style={{ objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title className="title">{novel.title}</Card.Title>
                        <Button as={Link} to={`/story-detail/${novel._id}`} className="btn-view-more rounded-pill">Ver más</Button>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </Slider>
            ) : (
              <p>No hay novelas disponibles.</p>
            )
          )}
        </Container>
      </section>

      <div className="ranking-container py-5">
        <Container>
          <h2 className="ranking-title text-center">🌟 Reconocimiento a Nuestro Equipo 🌟</h2>
          <div className="row">
            <div className="col-lg-4">
              <h3 className="category-title">📖 Traductores</h3>
              <ul className="ranking-list">
                <li><span className="medal gold">🥇</span> <a href="#">Ji Shenn</a></li>
                <li><span className="medal silver">🥈</span> <a href="#">Bezy</a></li>
                <li><span className="medal bronze">🥉</span> <a href="#">Rajesh Rouv</a></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h3 className="category-title">✍️ Editores</h3>
              <ul className="ranking-list">
                <li><span className="medal gold">🥇</span> <a href="#">Japonnesa</a></li>
                <li><span className="medal silver">🥈</span> <a href="#">Hikari</a></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h3 className="category-title">💖 Patrocinadores</h3>
              <ul className="ranking-list">
                <li className="sponsor"><span className="medal gold">🥇</span> <a href="#">Japonnesa</a></li>
              </ul>
            </div>
          </div>
        </Container>
      </div>


      <Container className="mt-4">
        <h2 className="text-center mb-4" style={{ color: '#D6B4A1' }}>Últimas Actualizaciones</h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <p>Cargando capítulos...</p>
          </div>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : latestChapters.length === 0 ? (
          <p className="text-center">No hay actualizaciones recientes.</p>
        ) : (
          <Row className="g-3 justify-content-center">
            {latestChapters.map((entry, index) => {
              const chapterNumbers = entry.chapters.map(chap => chap.chapterNumber);
              const firstChapter = Math.min(...chapterNumbers);
              const lastChapter = Math.max(...chapterNumbers);

              const firstChapterTitle = entry.chapters.find(chap => chap.chapterNumber === firstChapter)?.title;
              const lastChapterTitle = entry.chapters.find(chap => chap.chapterNumber === lastChapter)?.title;

              const datePublished = new Date(entry.publishedAt);
              const formattedDate = datePublished instanceof Date && !isNaN(datePublished)
                ? datePublished.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
                : 'Fecha no disponible';

              return (
                <Col key={index} md={6} lg={4} className="d-flex">
                  <Card className="chapter-card flex-fill shadow-sm" style={{ backgroundColor: '#D1B6B1 ', borderRadius: '12px' }}>
                    <div className="card-body" style={{ padding: '1.2rem', color: '#5F7D8B' }}>
                      <h5 className="card-title d-flex align-items-center" style={{ color: '#2C3E50' }}>
                        <BookOpen size={30} className="me-2" />
                        {entry.novelTitle} {/* Título de la novela */}
                      </h5>
                      <p className="card-text date d-flex align-items-center" style={{ color: '#8E5A3F ', fontSize: '0.9rem' }}>
                        <Calendar size={18} className="me-2" />
                        {formattedDate} {/* Fecha de publicación */}
                      </p>
                      <p className="card-text" style={{ color: '#8C6A4B' }}>
                        {firstChapter === lastChapter
                          ? `Capítulo actualizado: ${firstChapterTitle || 'No disponible'}`
                          : `Actualización de capítulos: ${firstChapterTitle || 'No disponible'} - ${lastChapterTitle || 'No disponible'}`}
                      </p>
                      <Link to={`/story-detail/${entry.novelId}`} className="btn btn-primary" style={{ backgroundColor: '#8C6A4B', color: '#D0C4B7', borderRadius: '25px', padding: '0.8rem 1.5rem' }}>
                        Leer novela <ArrowRight />
                      </Link>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      <section className="latest-translations py-5">
        <Container>
          <h2 className="text-center mb-4" style={{ color: '#D6B4A1' }}>Últimas Traducciones</h2>
          <Row>
            {latestNovels.map(novel => (
              <Col key={novel._id} md={4} className="mb-4">
                <Card className="rounded shadow-sm">
                  <Card.Img variant="top" src={novel.coverImage} alt={novel.title} />
                  <Card.Body className="text-center">
                    <Card.Title>{novel.title}</Card.Title>
                    <Card.Text>{novel.genre}</Card.Text>
                    <Button as={Link} to={`/story-detail/${novel._id}`} className="btn-outline-dark">Leer más</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>


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

      <section className="history-and-achievements py-5 bg-dark">
        <Container>
          <h2 className="text-center mb-4">Historia y Logros</h2>
          <Row>
            <Col md={12}>
              <div className="timeline">
                {[{ date: "21 Nov 2024", text: "Creación del servidor" },
                { date: "24 Nov 2024", text: "Primera reunión del equipo" },
                { date: "25 Nov 2024", text: "Inicio de la programación" },
                { date: "3 Dic 2024", text: "Lanzamiento de la primera versión" },
                { date: "7 Dic 2024", text: "Primera Funa de Pabellón." },
                { date: "28 Feb 2025", text: "Lanzamiento de la segunda versión" }]
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