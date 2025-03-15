import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";

const ADMIN_ID = "674ceb9febf82a8ddeecbbea"; // ID del administrador

const SelectManhua = () => {
  const navigate = useNavigate();
  const [manhuas, setManhuas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId !== ADMIN_ID) {
      alert("No tienes permisos para acceder a esta página.");
      navigate("/");
      return;
    }

    const fetchManhuas = async () => {
      try {
        const response = await axios.get("/api/manhuas");
        setManhuas(response.data);
      } catch (err) {
        console.error("Error al obtener los Manhuas:", err);
        setError("No se pudieron cargar los Manhuas.");
      } finally {
        setLoading(false);
      }
    };

    fetchManhuas();
  }, [navigate, userId]);

  return (
    <Container className="select-manhua-container">
      <h2 className="section-title">Selecciona un Manhua</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {manhuas.map((manhua) => (
          <Col key={manhua._id} md={6} lg={4} className="mb-4">
            <Card className="manhua-card" onClick={() => navigate(`/upload-chapter/${manhua._id}`)}>
              <Card.Img variant="top" src={manhua.coverImage} alt={manhua.title} />
              <Card.Body>
                <Card.Title>{manhua.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SelectManhua;