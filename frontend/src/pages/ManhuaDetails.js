import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, Spinner, ListGroup } from "react-bootstrap";
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
      <Container className="text-center mt-4">
        <Spinner animation="border" className="spinner" />
      </Container>
    );
  }

  if (!manhua) {
    return <p className="text-center mt-4">No se encontraron detalles para este manhua.</p>;
  }

  return (
    <Container className="manhua-details">
      <Button className="back-button" onClick={() => navigate(-1)}>
        ← Volver a la lista
      </Button>

      <Row className="manhua-info mt-3">
        {/* Imagen de portada */}
        <Col md={4}>
          <img
            src={manhua.coverImage || "/default-cover.jpg"}
            alt={manhua.title}
            className="manhua-cover img-fluid"
            loading="lazy"
          />
        </Col>

        {/* Información del manhua */}
        <Col md={8} className="manhua-text">
          <h2>{manhua.title}</h2>
          <p><strong>📖 Géneros:</strong> {manhua.genres?.join(", ") || "Desconocido"}</p>
          <p><strong>👥 Demografía:</strong> {manhua.demography || "Desconocido"}</p>
          <p className="manhua-description">{manhua.description}</p>
        </Col>
      </Row>

      {/* Lista de capítulos */}
      <h3 className="mt-4">📜 Capítulos</h3>
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