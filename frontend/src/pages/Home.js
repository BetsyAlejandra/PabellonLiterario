// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/global.css';
import marcadeagua from '../assets/Marca de Agua2.png';

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

  // Función para dividir el array en grupos de 3
  const chunkArray = (array, chunkSize) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };

  // Dividir las novelas en grupos de 3 sin limitar a uno solo
  const groupedNovels = chunkArray(novels, 3);

  // Dividir las últimas traducciones en 3 arriba y 2 abajo
  const topLatestNovels = latestNovels.slice(0, 3);
  const bottomLatestNovels = latestNovels.slice(3, 5);

  return (
    <div className="home-page">
      {/* Sección de Marca de Agua con el botón ¡Únete! */}
      <section className="watermark-section">
        <div className="watermark-overlay text-center">
          <img src={marcadeagua} alt="Marca de agua" className="watermark-logo" />
          <Button href="https://discord.gg/Np8prZDgwX" variant="primary" className="join-button">
            ¡ÚNETE!
          </Button>
          <div className="join-button-text">
            <p>Únete a nuestra comunidad para más sorpresas.</p>
          </div>
        </div>
      </section>

      {/* Mostrar mensaje de error si existe */}
      {error && <p className="text-center text-danger">{error}</p>}

      {/* Galería de Portadas de Obras Traducidas */}
      <section className="translated-works-gallery">
        <Container>
          <h2 className="text-center text-light">Galería de Obras Traducidas</h2>
          {loading ? (
            <p className="text-center text-light">Cargando novelas...</p>
          ) : (
            <Carousel interval={3000} indicators={groupedNovels.length > 1} pause={false}>
              {groupedNovels.length > 0 ? (
                groupedNovels.map((group, groupIndex) => (
                  <Carousel.Item key={groupIndex}>
                    <div className="d-flex justify-content-center">
                      {group.map((novel) => (
                        <Card
                          key={novel._id}
                          className="text-center bg-dark text-light border-0 mx-2"
                          style={{
                            width: "300px", // Ajusta el ancho de cada tarjeta
                            height: "400px", // Ajusta la altura de cada tarjeta
                          }}
                        >
                          <Card.Img
                            variant="top"
                            src={novel.coverImage}
                            alt={`Cover image for ${novel.title}`}
                            style={{
                              height: "250px",
                              objectFit: "cover", // Asegura que las imágenes estén bien proporcionadas
                            }}
                          />
                          <Card.Body>
                            <Card.Title className="text-light">{novel.title}</Card.Title>
                            <Button as={Link} variant="outline-light" to={`/story-detail/${novel._id}`}>
                              Ver más
                            </Button>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Carousel.Item>
                ))
              ) : (
                <p className="text-center text-light">No hay novelas disponibles</p>
              )}
            </Carousel>

          )}
        </Container>
      </section>

      {/* Últimas Traducciones y Soporte */}
      <section className="latest-translations-and-support mt-5">
        <Container>
          <Row>
            {/* Últimas Traducciones */}
            <Col md={6} className="latest-translations">
              <h2 className="text-light">Últimas Traducciones</h2>
              <Row>
                {latestNovels.length === 0 ? (
                  <p className="text-light">No hay traducciones recientes.</p>
                ) : (
                  latestNovels.map((novel, index) => (
                    <Col
                      key={novel._id}
                      className="mb-4 d-flex justify-content-center"
                      md={index < 3 ? 4 : 6} // 3 en la primera fila (md=4), 2 en la segunda (md=6)
                      sm={6}
                      xs={12}
                    >
                      <Card className="bg-dark text-light border-light position-relative">
                        <Card.Img
                          variant="top"
                          src={novel.coverImage}
                          alt={`Cover image for ${novel.title}`}
                          className="card-img latest-translation-image"
                        />
                        <div className="overlay">
                          <Card.Body>
                            <Card.Title>{novel.title}</Card.Title>
                            <Card.Text>{novel.genre}</Card.Text>
                            <Button as={Link} variant="outline-light" to={`/story-detail/${novel._id}`}>
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

            {/* Sección de Soporte y Discord */}
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
          </Row>
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