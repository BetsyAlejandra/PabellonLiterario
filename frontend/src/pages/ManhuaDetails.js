import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, Spinner, ListGroup, Card } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import "../styles/ManhuaDetails.css";

const ManhuaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manhua, setManhua] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManhuaDetails = async () => {
      try {
        const response = await axios.get(`/api/manhuas/${id}`);
        setManhua(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles del manhua", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManhuaDetails();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" className="spinner" />
      </Container>
    );
  }

  if (!manhua) {
    return <p className="text-center mt-4">No se encontraron detalles para este manhua.</p>;
  }

  return (
    <Container className="manhua-details">
      {/* Botón de regreso */}
      <Button className="back-button" onClick={() => navigate(-1)}>
        <BsArrowLeft size={20} className="me-2" /> Volver a la lista
      </Button>

      {/* Tarjeta principal del manhua */}
      <Card className="manhua-card mt-3">
        <Row className="g-4">
          <Col md={4}>
            <Card.Img
              src={manhua.coverImage || "/default-cover.jpg"}
              alt={manhua.title}
              className="manhua-cover"
              loading="lazy"
            />
          </Col>

          <Col md={8} className="manhua-text">
            <Card.Body>
              <Card.Title>{manhua.title}</Card.Title>
              <Card.Text><strong>📖 Géneros:</strong> {manhua.genres?.join(", ") || "Desconocido"}</Card.Text>
              <Card.Text><strong>👥 Demografía:</strong> {manhua.demographic || "Desconocido"}</Card.Text>
              <Card.Text><strong>📌 Estado:</strong> {manhua.status || "Desconocido"}</Card.Text>
              <Card.Text className="manhua-description">{manhua.description}</Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Lista de capítulos */}
      <h3 className="mt-4 section-title">📜 Capítulos</h3>
      {manhua.chapters && manhua.chapters.length > 0 ? (
        <ListGroup className="chapter-list">
          {manhua.chapters.map((chapter) => (
            <ListGroup.Item
              key={chapter._id}
              className="chapter-item"
              action
              onClick={() => navigate(`/manhua/${id}/chapter/${chapter.number}`)}
            >
              {chapter.title || `Capítulo ${chapter.number}`}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">No hay capítulos disponibles.</p>
      )}
    </Container>
  );
};

export default ManhuaDetails;