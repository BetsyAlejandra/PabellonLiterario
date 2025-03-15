import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/RecentManhua.css";

const RecentManhua = () => {
  const [manhuas, setManhuas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Cargar manhuas recientes
  useEffect(() => {
    const fetchRecentManhuas = async () => {
      try {
        const { data } = await axios.get(`/api/manhuas/recent?page=${page}`);
        setManhuas((prev) => [...prev, ...data.manhuas]); // Agrega más resultados a la lista
        setHasMore(data.hasMore);
      } catch (err) {
        console.error("Error al cargar los manhuas recientes:", err);
        setError("Hubo un problema al cargar los manhuas.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentManhuas();
  }, [page]); // Se ejecuta cuando cambia la página

  return (
    <Container className="recent-container">
      <h2 className="recent-title">Manhuas Recientes</h2>

      {/* Mostrar errores */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Mensaje de carga */}
      {loading && page === 1 && (
        <div className="text-center">
          <Spinner animation="border" />
          <p className="loading-text">Cargando manhuas recientes...</p>
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
                <Card.Text className="manhua-genres">{manhua.genres.join(", ")}</Card.Text>
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
      {!hasMore && <p className="text-center loading-text">No hay más manhuas recientes.</p>}
    </Container>
  );
};

export default RecentManhua;