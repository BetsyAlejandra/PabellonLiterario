import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/PopularManhua.css"; // Importamos los estilos

const PopularManhua = () => {
  const [manhuas, setManhuas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Cargar manhuas populares
  useEffect(() => {
    const fetchPopularManhuas = async () => {
      try {
        const { data } = await axios.get(`/api/manhuas/popular?page=${page}`);
        setManhuas((prev) => [...prev, ...data.manhuas]); // Agrega más resultados a la lista
        setHasMore(data.hasMore);
      } catch (err) {
        console.error("Error al cargar los manhuas populares:", err);
        setError("Hubo un problema al cargar los manhuas.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularManhuas();
  }, [page]); // Se ejecuta cuando cambia la página

  return (
    <Container className="popular-container">
      <h2 className="popular-title">Manhuas Populares</h2>

      {/* Mostrar errores */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Mensaje de carga */}
      {loading && page === 1 && (
        <div className="text-center">
          <Spinner animation="border" />
          <p className="loading-text">Cargando manhuas populares...</p>
        </div>
      )}

      {/* Mostrar lista de manhuas */}
      <Row>
        {manhuas.map((manhua) => (
          <Col key={manhua._id} md={4} className="mb-4">
            <Card className="manhua-card">
              <Card.Img variant="top" src={manhua.coverImage} alt={manhua.title} className="manhua-cover" />
              <Card.Body className="manhua-card-body">
                <Card.Title className="manhua-title">{manhua.title}</Card.Title>
                <Card.Text className="manhua-info">
                  <strong>Vistas:</strong> {manhua.views} <br />
                  <strong>Likes:</strong> {manhua.likes}
                </Card.Text>
                <Link to={`/manhua/${manhua._id}`} className="btn view-details">
                  Ver detalles
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Botón para cargar más manhuas */}
      {hasMore && !loading && (
        <Button onClick={() => setPage(page + 1)} className="load-more-btn">
          Cargar más
        </Button>
      )}

      {/* Mensaje si no hay más manhuas */}
      {!hasMore && <p className="text-center loading-text">No hay más manhuas populares.</p>}
    </Container>
  );
};

export default PopularManhua;