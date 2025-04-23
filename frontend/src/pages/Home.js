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


  return (
    <div className="home-page">
      <header className="hero-section d-flex align-items-center" style={{ backgroundImage: `url(${headerImage})` }}>
        <Container className="text-center text-light">
          <h1 className="hero-title">Pabellón Literario</h1>
          <p className="hero-subtitle">Donde la literatura cobra vida</p>
          <Button href="https://discord.gg/hV2APBNYYS" variant="light" className="join-btn">¡ÚNETE!</Button>
        </Container>
      </header>


      <div class="ranking-container">
        <h2 class="ranking-title">🌟 Reconocimiento a Nuestro Equipo 🌟</h2>

        <div class="ranking-sections">
          <div class="ranking-category">
            <h3 class="category-title">📖 Traductores</h3>
            <ul class="ranking-list">
              <li><span class="medal gold">🥇</span> <a href="https://pabellonliterario.com/profileperson/Bezy" target="_blank">Bezy</a></li>
              <li><span class="medal silver">🥈</span> <a href="https://pabellonliterario.com/profileperson/Rajesh%20Rouv" target="_blank">Rajesh Rouv</a></li>
              <li><span class="medal bronze">🥉</span> <a href="https://pabellonliterario.com/profileperson/plutommo" target="_blank">Plutommo</a></li>
            </ul>
          </div>

          <div class="ranking-category">
            <h3 class="category-title">✍️ Editores</h3>
            <ul class="ranking-list">
              <li><span class="medal gold">🥇</span> <a href="https://pabellonliterario.com/profileperson/Japonnesa" target="_blank">Japonnesa</a></li>
              <li><span class="medal silver">🥈</span><a href="https://pabellonliterario.com/profileperson/Hualianxo" target="_blank">Hualianxo</a></li>
              <li><span class="medal bronze">🥉</span><a href="https://pabellonliterario.com/profileperson/plutommo" target="_blank">Plutommo</a></li>
            </ul>
          </div>

          <div class="ranking-category">
            <h3 class="category-title">💖 Patrocinadores</h3>
            <ul class="ranking-list">
              <li class="sponsor"><span class="medal gold">🥇</span> <a target="_blank">Japonnesa</a></li>
              <li class="sponsor"><span class="medal silver">🥈</span> <a target="_blank">Meow</a></li>
              <li class="sponsor"><span class="medal bronze">🥉</span> <a>21R_Bingqiu</a></li>
              <li class="sponsor"><a target="_blank">kmiloca</a></li>
              <li class="sponsor"><a target="_blank">Dulcesitoxx</a></li>
            </ul>
          </div>
        </div>
      </div>

      <section className="translated-works-gallery py-5">
        <Container>
          <h2 className="text-center mb-4">🪶 Últimas Novelas Agregadas</h2>
          <Row>
            {novelsMemo.slice(0, 6).map((novel, index) => (
              <Col xs={12} md={6} key={novel._id}>
                <Card className="stacked-novel-card mb-4 position-relative">
                  {index < 3 && <div className="badge-new">✨ Nuevo</div>}

                  <Row className="g-0 align-items-center">
                    <Col xs={4}>
                      <Card.Img
                        src={novel.coverImage}
                        alt={novel.title}
                        className="img-fluid rounded-start"
                      />
                    </Col>
                    <Col xs={8}>
                      <Card.Body>
                        <Card.Title className="title-trim">{novel.title}</Card.Title>

                        {novel.genres && (
                          <div className="genre-tag">
                            {novel.genres}
                          </div>
                        )}

                        <Button
                          as={Link}
                          to={`/story-detail/${novel._id}`}
                          className="btn-view-more mt-3"
                        >
                          Ver más
                        </Button>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>


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

      <section className="support-and-apply py-5" style={{ backgroundColor: "#F1E4D1" }}>
        <Container>
          <h2 className="text-center mb-5" style={{ color: "#A67C52" }}>¡Forma parte del Pabellón!</h2>
          <Row className="g-4 justify-content-center">
            <Col md={6}>
              <Card className="h-100 text-center shadow rounded" style={{ backgroundColor: "#FFF8F2" }}>
                <Card.Body>
                  <div className="mb-3" style={{ fontSize: "2rem" }}>💖</div>
                  <Card.Title className="mb-2">¡Apóyanos!</Card.Title>
                  <Card.Text>Ayúdanos con una donación en Ko-fi para seguir compartiendo historias maravillosas.</Card.Text>
                  <Button
                    href="https://ko-fi.com/betsyalejandra"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline-danger"
                    className="rounded-pill mt-3"
                  >
                    ¡Apóyanos en Ko-fi!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 text-center shadow rounded" style={{ backgroundColor: "#EFEAF4" }}>
                <Card.Body>
                  <div className="mb-3" style={{ fontSize: "2rem" }}>🌟</div>
                  <Card.Title className="mb-2">¡Únete a Nuestro Equipo!</Card.Title>
                  <Card.Text>
                    Buscamos <strong>traductores</strong>, <strong>editores</strong>, <strong>timmers</strong> y <strong>transcriptores</strong> para nuestros audiodramas y novelas. ¡Tu talento es bienvenido!
                  </Card.Text>
                  <Button
                    as={Link}
                    to="/postular"
                    variant="outline-primary"
                    className="rounded-pill mt-3"
                  >
                    Postúlate aquí
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>


      <section className="history-and-achievements py-5 bg-dark text-light">
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
                    <div key={index} className="timeline-item d-flex align-items-center mb-4">
                      <div className="timeline-icon">
                        <span className="icon-text">{index + 1}</span>
                      </div>
                      <div className="timeline-content">
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