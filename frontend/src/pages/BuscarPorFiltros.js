import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "../styles/BuscarPorFiltros.css";

const BuscarPorFiltros = () => {
  const [filters, setFilters] = useState({
    genero: "",
    estado: "",
    idioma: "",
  });
  const [novels, setNovels] = useState([]);
  const [filteredNovels, setFilteredNovels] = useState([]);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await fetch("/api/novels");
        const data = await response.json();
        setNovels(data); // Asignar todas las novelas a novels
        setFilteredNovels(data); // Inicialmente mostrar todas las novelas
      } catch (error) {
        console.error("Error al obtener las novelas:", error);
      }
    };

    fetchNovels();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const { genero, estado, idioma } = filters;

    const filtered = novels.filter((novel) => {
      const matchesGenero = genero ? novel.genre === genero : true;
      const matchesEstado = estado ? novel.status === estado : true;
      const matchesIdioma = idioma ? novel.originalLanguage === idioma : true;

      return matchesGenero && matchesEstado && matchesIdioma;
    });

    setFilteredNovels(filtered);
  };

  return (
    <div className="search-page">
      <Container>
        <h2 className="search-title">Buscar por Filtros</h2>
        <Form onSubmit={handleFilterSubmit} className="filter-form">
          <Row>
            {/* Género */}
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Género</Form.Label>
                <Form.Control
                  as="select"
                  name="genero"
                  value={filters.genero}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="Fantasia">Fantasía</option>
                  <option value="Romance">Romance</option>
                  <option value="Accion">Acción</option>
                  <option value="Danmei">Danmei</option>
                  <option value="Drama">Drama</option>
                </Form.Control>
              </Form.Group>
            </Col>

            {/* Estado */}
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="Completado">Completado</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Pausado">Pausado</option>
                </Form.Control>
              </Form.Group>
            </Col>

            {/* Idioma */}
            <Col md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Idioma Original</Form.Label>
                <Form.Control
                  as="select"
                  name="idioma"
                  value={filters.idioma}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="Chino">Chino</option>
                  <option value="Ingles">Inglés</option>
                  <option value="Coreano">Coreano</option>
                  <option value="Japones">Japonés</option>
                </Form.Control>
              </Form.Group>
            </Col>

            {/* Botón de búsqueda */}
            <Col md={3} className="mb-3 d-flex align-items-end">
              <Button type="submit" variant="primary" className="w-100">
                Buscar
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Resultados */}
        <Row className="mt-4">
          {filteredNovels.length > 0 ? (
            filteredNovels.map((novel) => (
              <Col md={4} key={novel._id} className="mb-4">
                <Card className="novel-card">
                  <Card.Img
                    variant="top"
                    src={novel.coverImage}
                    alt={`Portada de ${novel.title}`}
                    className="novel-card-img"
                  />
                  <Card.Body>
                    <Card.Title>{novel.title}</Card.Title>
                    <Card.Text>{novel.genre}</Card.Text>
                    <Button
                      href={`/story-detail/${novel._id}`}
                      variant="outline-primary"
                    >
                      Ver más
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center text-light w-100">
              No se encontraron resultados.
            </p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default BuscarPorFiltros;