import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/homeStyles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import headerImage from '../assets/header.png'; // Imagen de encabezado
import AdSense from '../Components/AdSense';

import Slider from "react-slick";

const Home = () => {
  const [novels, setNovels] = useState([]); // Estado para almacenar las novelas
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
  const [latestNovels, setLatestNovels] = useState([]); // Estado para las últimas traducciones
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch('/api/novels');
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Respuesta no es JSON');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setNovels(data); // Asegúrate de que sea un arreglo
        } else {
          throw new Error('Respuesta inesperada: no es un arreglo');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error en fetchNovels:', error.message);
        setError(error.message);
        setNovels([]); // Asegúrate de que novels siempre sea un arreglo
        setLoading(false);
      }
    };

    const fetchLatestNovels = async () => {
      try {
        const response = await fetch('/api/novels/latest');
        if (!response.ok) throw new Error('Error al obtener últimas novelas');
        const data = await response.json();
        setLatestNovels(data); // Actualiza el estado
      } catch (error) {
        console.error('Error en fetchLatestNovels:', error.message);
        setError(error.message);
        setLatestNovels([]);
      }
    };

    fetchNovels();
    fetchLatestNovels(); // Llama a ambas funciones al montar el componente
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Mostrar 2 tarjetas en pantallas medianas
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1, // Mostrar 1 tarjeta en pantallas pequeñas
        },
      },
    ],
  };

  return (
    <div className="home-page">
      {/* Encabezado */}
      <header
        className="header-section"
        style={{
          backgroundImage: `url(${headerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="header-content text-center">
          <h1 className="header-title">Pabellón Literario</h1>
          <p className="header-subtitle">Únete a nuestra comunidad para más sorpresas</p>
          <Button href="https://discord.gg/Np8prZDgwX" variant="light" className="header-button">
            ¡ÚNETE!
          </Button>
        </div>
      </header>

      {/* Espacio para Anuncio 1 */}
      {novels.length > 0 && (
        <section className="ad-section my-4">
          <Container>
            <div className="ad-section-container">
              <AdSense
                adClient="ca-pub-3101266953328074"
                adSlot="2736107499"
                style={{ display: "block" }}
              />
            </div>
          </Container>
        </section>
      )}

      {/* Galería de Obras Traducidas */}
      <section className="translated-works-gallery">
        <Container>
          <h2 className="section-title">Galería de Obras Traducidas</h2>
          {loading ? (
            <p className="text-center text-light">Cargando novelas...</p>
          ) : (
            <Slider {...settings}>
              {novels.map((novel) => (
                <Card key={novel._id} className="gallery-card">
                  <Card.Img
                    variant="top"
                    src={novel.coverImage}
                    alt={`Portada de ${novel.title}`}
                    className="gallery-card-img"
                  />
                  <Card.Body className="gallery-card-body">
                    <Card.Title className="gallery-card-title">{novel.title}</Card.Title>
                    <Button
                      as={Link}
                      to={`/story-detail/${novel._id}`}
                      className="gallery-card-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ver más
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </Slider>
          )}
        </Container>
      </section>

      {/* Espacio para Anuncio 2 */}
      <section className="ad-section my-4">
        <Container>
          <div className="ad-section-container">
            <AdSense
              adClient="ca-pub-3101266953328074"
              adSlot="8089975138"
              style={{ display: "block" }}
            />
          </div>
        </Container>
      </section>

      {/* Últimas Traducciones */}
      <section className="latest-translations">
        <Container>
          <h2 className="section-title">Últimas Traducciones</h2>
          <Row>
            {latestNovels.map((novel) => (
              <Col key={novel._id} md={4} className="latest-translation-card">
                <Card className="latest-card">
                  <Card.Img
                    variant="top"
                    src={novel.coverImage}
                    alt={`Portada de ${novel.title}`}
                    className="latest-card-img"
                  />
                  <Card.Body>
                    <Card.Title>{novel.title}</Card.Title>
                    <Card.Text>{novel.genre}</Card.Text>
                    <Button as={Link} to={`/story-detail/${novel._id}`} className="latest-card-btn">
                      Leer más
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        <Container>
          {/* Sección de Soporte y Discord */}
          <Row className="support-and-apply-section">
            <Col md={6} className="support-section text-light">
              <h2>¡Apóyanos!</h2>
              <p>
                Si te gustan nuestras traducciones y quieres ayudarnos a seguir, puedes hacerlo con una pequeña donación en
                nuestro perfil de Ko-fi.
              </p>
              <Button
                href="https://ko-fi.com/betsyalejandra"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline-light"
              >
                ¡Apóyanos en Ko-fi!
              </Button>

              <h2 className="mt-4">¡Únete a Nuestro Discord!</h2>
              <p>
                Si eres amante de las letras, las historias cautivadoras y las traducciones literarias, Pabellón Literario es el
                lugar perfecto para ti. ¡Únete y haz de nuestro servidor tu rincón literario favorito!
                <br></br>En Pabellón Literario, las palabras tienen el poder de unirnos. ¡Te esperamos para que formes parte de esta
                comunidad única! 💕
              </p>
              <Button
                href="https://discord.gg/Np8prZDgwX"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline-light"
              >
                ¡Únete al Discord!
              </Button>
            </Col>

            {/* Anuncio de Postulación */}
            <Col md={6} className="apply-section text-light">
              <h2>¡Únete a Nuestro Equipo!</h2>
              <p>
                ¿Te apasionan las letras? Buscamos traductores (de cualquier idioma), escritores y editores.
                Forma parte de nuestro equipo y comparte tu talento con la comunidad.
              </p>
              <Button
                as={Link}
                to="/postular"
                variant="outline-light"
              >
                Postúlate Aquí
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Espacio para Anuncio 3 */}
      <section className="ad-section my-4">
        <Container>
          <div className="ad-section-container">
            <AdSense
              adClient="ca-pub-3101266953328074"
              adSlot="7936463288"
              style={{ display: "block" }}
            />
          </div>
        </Container>
      </section>

      {/* Historia y Logros */}
      <section className="history-and-achievements py-5">
        <Container>
          <h2 className="text-center text-white mb-5">Historia y Logros del Proyecto</h2>
          <p className="text-center text-white mb-5">
            Esta línea del tiempo resalta los hitos clave que marcaron el desarrollo de nuestro proyecto, desde su
            conceptualización hasta su primera versión lanzada al público.
          </p>
          <Row>
            <Col md={12}>
              <div className="timeline">
                {/* Timeline Items */}
                <div className="timeline-item">
                  <div className="timeline-icon">📅</div>
                  <div className="timeline-content">
                    <h5>21 de Noviembre del 2024</h5>
                    <p>
                      Creación del servidor: Este día marcó el nacimiento de nuestra comunidad. Creamos un espacio en Discord para
                      unir a personas apasionadas por la literatura, con el objetivo de compartir ideas y colaborar en la creación del
                      proyecto.
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">💻</div>
                  <div className="timeline-content">
                    <h5>25 de Noviembre del 2024</h5>
                    <p>
                      Inicio de la programación: Después de días de planificación, comenzamos a trabajar en la estructura técnica del
                      proyecto, incluyendo el diseño del frontend y backend con el stack MERN.
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">🤝</div>
                  <div className="timeline-content">
                    <h5>24 de Noviembre del 2024</h5>
                    <p>
                      Primera reunión entre las 7 iniciadoras: Las mentes detrás del proyecto se reunieron por primera vez para alinear
                      objetivos, discutir el alcance y definir roles clave. Esta colaboración sentó las bases para el éxito del
                      proyecto.
                    </p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">🎉</div>
                  <div className="timeline-content">
                    <h5>3 de Diciembre del 2024</h5>
                    <p>
                      Lanzamiento de la primera versión: Después de semanas intensas de trabajo, presentamos al público la primera
                      versión de nuestra plataforma, que incluye funcionalidades básicas como subir traducciones, guardar progreso de
                      lectura y dejar comentarios.
                    </p>
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