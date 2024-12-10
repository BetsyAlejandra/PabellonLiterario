import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/homeStyles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import headerImage from '../assets/header.png'; // Imagen de encabezado

import Slider from "react-slick";

const Home = () => {
  const [novels, setNovels] = useState([]); // Estado para almacenar las novelas
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
  const [latestNovels, setLatestNovels] = useState([]); // Estado para las últimas traducciones
  const [updatedChapters, setUpdatedChapters] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar novelas
        const novelsResponse = await fetch('/api/novels');
        const novelsContentType = novelsResponse.headers.get('content-type');
        if (!novelsContentType || !novelsContentType.includes('application/json')) {
          throw new Error('La respuesta de novelas no es JSON');
        }
        const novelsData = await novelsResponse.json();
        if (!Array.isArray(novelsData)) {
          throw new Error('Respuesta inesperada: novelas no es un arreglo');
        }
        setNovels(novelsData);
  
        // Cargar últimas novelas
        const latestNovelsResponse = await fetch('/api/novels/latest');
        if (!latestNovelsResponse.ok) throw new Error('Error al obtener últimas novelas');
        const latestNovelsData = await latestNovelsResponse.json();
        setLatestNovels(latestNovelsData);
  
        // Cargar capítulos actualizados
        const updatedChaptersList = [];
        for (const novel of novelsData) {
          const chaptersResponse = await fetch(`/api/novels/${novel._id}/updated-chapters`);
          if (!chaptersResponse.ok) {
            console.error(`Error al obtener capítulos para novela ${novel._id}`);
            continue;
          }
          const chaptersData = await chaptersResponse.json();
          updatedChaptersList.push(...chaptersData.updatedChapters);
        }
  
        // Ordenar capítulos por fecha y limitar a los 10 más recientes
        updatedChaptersList.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setUpdatedChapters(updatedChaptersList.slice(0, 10));
  
        // Establecer el estado de carga como falso
        setLoading(false);
      } catch (error) {
        console.error('Error en fetchData:', error.message);
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const settings = {
    dots: true,
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

      {/* Últimas Traducciones y Últimos Capítulos */}
      <section className="latest-section">
        <Container>
          <Row>
            {/* Últimas Traducciones */}
            <Col md={6}>
              <h2 className="section-title">Últimas Traducciones</h2>
              <Row>
                {latestNovels.map((novel) => (
                  <Col key={novel._id} md={12} className="latest-item">
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
            </Col>

            <section className="latest-chapters">
              <Container>
                <h2 className="section-title">Últimos Capítulos Actualizados</h2>
                {loading ? (
                  <p className="text-center text-light">Cargando capítulos...</p>
                ) : error ? (
                  <p className="text-center text-danger">{error}</p>
                ) : updatedChapters.length > 0 ? (
                  <Row>
                    {updatedChapters.map((chapter, index) => (
                      <Col key={index} md={6} className="mb-4">
                        <Card className="chapter-card">
                          <Card.Body>
                            <Card.Title>{chapter.title}</Card.Title>
                            <Card.Text>
                              Actualizado: {new Date(chapter.updatedAt).toLocaleDateString()}
                            </Card.Text>
                            <Button as={Link} to={`/chapter-detail/${chapter._id}`} variant="outline-light">
                              Leer capítulo
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-center text-light">No hay capítulos actualizados recientemente.</p>
                )}
              </Container>
            </section>
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
            </Col>
          </Row>
        </Container >
      </section >

      {/* Historia y Logros */}
      < section className="history-and-achievements py-5" >
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
      </section >
    </div >
  );
};

export default Home;