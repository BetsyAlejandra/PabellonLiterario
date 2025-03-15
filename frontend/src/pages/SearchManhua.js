import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../styles/SearchManhua.css'

const SearchManhua = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Manejo de la búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`/api/manhuas/search?query=${query}`);
      setResults(data);
      if (data.length === 0) {
        setError("No se encontraron resultados.");
      }
    } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError("Hubo un problema con la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="search-container mt-4">
      <h2 className="search-title">🔍 Buscar Manhua</h2>

      {/* Formulario de búsqueda */}
      <Form onSubmit={handleSearch} className="search-form mb-4">
        <Row className="align-items-center">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Escribe el título, género o demografía..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </Col>
          <Col md={4}>
            <button type="submit" className="search-btn w-100">
              Buscar
            </button>
          </Col>
        </Row>
      </Form>

      {/* Mensaje de carga */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted">Buscando...</p>
        </div>
      )}

      {/* Mostrar errores o mensaje de no resultados */}
      {error && <Alert variant="warning" className="text-center">{error}</Alert>}

      {/* Mostrar resultados */}
      <Row>
        {results.map((manhua) => (
          <Col key={manhua._id} md={4} className="mb-4">
            <Card className="manhua-card">
              <Card.Img variant="top" src={manhua.coverImage} alt={manhua.title} className="manhua-img" />
              <Card.Body>
                <Card.Title className="manhua-title">{manhua.title}</Card.Title>
                <Card.Text className="manhua-genres">{manhua.genres.join(", ")}</Card.Text>
                <Link to={`/manhua/${manhua._id}`} className="manhua-btn">
                  Ver detalles
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchManhua;