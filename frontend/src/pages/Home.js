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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        setNovels(Array.isArray(novelsData.novels) ? novelsData.novels : []);
        const chapters = Array.isArray(latestChaptersData.latestGroupedChapters) ? latestChaptersData.latestGroupedChapters : [];

        setLatestChapters(chapters);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const [latestChapters, setLatestChapters] = useState(() => []);
  const novelsMemo = novels;

  const settings = {
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
  };


  return (
    <div className="home-page">
      {/* Encabezado con precarga */}
      <header className="header-section" style={{ backgroundImage: `url(${headerImage})` }}>
        <Container className="text-center py-5">
          <h1>Pabellón Literario</h1>
          <p>Únete a nuestra comunidad para más sorpresas</p>
          <Button href="https://discord.gg/Np8prZDgwX" variant="light">¡ÚNETE!</Button>
        </Container>
      </header>

      {/* Galería de Obras Traducidas con carga diferida */}
      <section className="translated-works-gallery py-5">
        <Container>
          <h2 className="text-center mb-4">Galería de Obras Traducidas</h2>
          {loading ? (
            <Row>
              {[...Array(8)].map((_, index) => (
                <Col key={index} md={3} sm={6} xs={12} className="mb-3">
                  <div className="skeleton-card"></div>
                </Col>
              ))}
            </Row>
          ) : (
            novelsMemo.length > 0 ? (
              <Slider {...settings}>
                {novelsMemo.map(novel => (
                  <div key={novel._id} className="gallery-card-wrapper">
                    <Card className="gallery-card">
                      <Card.Img variant="top" src={novel.coverImage} alt={novel.title} />
                      <Card.Body>
                        <Card.Title className="title">{novel.title}</Card.Title>
                        <Button as={Link} to={`/story-detail/${novel._id}`} className="btn-view-more">Ver más</Button>
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


      <div class="ranking-container">
        <h2 class="ranking-title">🌟 Reconocimiento a Nuestro Equipo 🌟</h2>

        <div class="ranking-sections">
          <div class="ranking-category">
            <h3 class="category-title">📖 Traductores</h3>
            <ul class="ranking-list">
              <li><span class="medal gold">🥇</span> <a href="https://pabellonliterario.com/profileperson/Ji%20Shenn" target="_blank">Ji Shenn</a></li>
              <li><span class="medal silver">🥈</span> <a href="https://pabellonliterario.com/profileperson/Bezy" target="_blank">Bezy</a></li>
              <li><span class="medal bronze">🥉</span> <a href="https://pabellonliterario.com/profileperson/Rajesh%20Rouv" target="_blank">Rajesh Rouv</a></li>
              <li><a href="https://pabellonliterario.com/profileperson/plutommo" target="_blank">Plutommo</a></li>
              <li><a href="https://pabellonliterario.com/profileperson/Yrehil" target="_blank">Yrehil</a></li>
            </ul>
          </div>

          <div class="ranking-category">
            <h3 class="category-title">✍️ Editores</h3>
            <ul class="ranking-list">
              <li><span class="medal gold">🥇</span> <a href="https://pabellonliterario.com/profileperson/Japonnesa" target="_blank">Japonnesa</a></li>
              <li><span class="medal silver">🥈</span> <a href="https://pabellonliterario.com/profileperson/Hikari" target="_blank">Hikari</a></li>
              <li><span class="medal bronze">🥉</span> <a href="https://pabellonliterario.com/profileperson/Hualianxo" target="_blank">Hualianxo</a></li>
              <li><a href="https://pabellonliterario.com/profileperson/plutommo" target="_blank">Plutommo</a></li>
              <li><a href="https://pabellonliterario.com/profileperson/Luo_Wild" target="_blank">Luo_Wild</a></li>
            </ul>
          </div>

          <div class="ranking-category">
            <h3 class="category-title">💖 Patrocinadores</h3>
            <ul class="ranking-list">
              <li class="sponsor"><span class="medal gold">🥇</span> <a href="https://pabellonliterario.com/profileperson/Japonnesa" target="_blank">Japonnesa</a></li>
              <li class="sponsor"><span class="medal silver">🥈</span> <a href="https://pabellonliterario.com/profileperson/ShiniGreis" target="_blank">Shini Grace</a></li>
              <li class="sponsor"><span class="medal bronze">🥉</span> <a>Whitney</a></li>
              <li class="sponsor"><a href="https://pabellonliterario.com/profileperson/Casandra%20de%20Troya" target="_blank">Casandra De Troya</a></li>
              <li class="sponsor"><a href="https://pabellonliterario.com/profileperson/Flansas" target="_blank">Flansas</a></li>
            </ul>
          </div>
        </div>
      </div>



      <Container className="mt-4">
        <h2 className="text-center mb-4" style={{ color: '#F1E4D1' }}>Últimas Actualizaciones</h2>

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
              // Obtener el rango de capítulos
              const chapterNumbers = entry.chapters.map(chap => chap.chapterNumber);
              const firstChapter = Math.min(...chapterNumbers);
              const lastChapter = Math.max(...chapterNumbers);

              // Obtener el título del primer y último capítulo
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
                  <Card className="chapter-card flex-fill shadow-sm" style={{ backgroundColor: '#C9D6D5', borderRadius: '12px' }}>
                    <div className="card-body" style={{ padding: '1.2rem', color: '#F0E1D6' }}>
                      <h5 className="card-title d-flex align-items-center" style={{ color: '#5F7D8B' }}>
                        <BookOpen size={20} className="me-2" />
                        {entry.novelTitle} {/* Título de la novela */}
                      </h5>
                      <p className="card-text date d-flex align-items-center" style={{ color: '#5A3D42', fontSize: '0.9rem' }}>
                        <Calendar size={18} className="me-2" />
                        {formattedDate} {/* Fecha de publicación */}
                      </p>
                      <p className="card-text" style={{ color: '#8C6A4B' }}>
                        {firstChapter === lastChapter
                          ? `Capítulo actualizado: ${firstChapterTitle || 'No disponible'}`
                          : `Actualización de capítulos: ${firstChapterTitle || 'No disponible'} - ${lastChapterTitle || 'No disponible'}`}
                      </p>
                      <Link to={`/story-detail/${entry.novelId}`} className="btn btn-primary" style={{ backgroundColor: '#C1D0B5', color: '#D6B4A1', borderRadius: '25px', padding: '0.8rem 1.5rem' }}>
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