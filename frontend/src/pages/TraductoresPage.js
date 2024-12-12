import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Pagination } from 'react-bootstrap';
import '../styles/TranslatorsPage.css';

const TranslatorsPage = () => {
  const [translators, setTranslators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const translatorsPerPage = 8;

  useEffect(() => {
    const fetchTranslators = async () => {
      try {
        const response = await fetch('/api/users/translators');
        if (!response.ok) {
          throw new Error('Error al obtener los traductores');
        }
        const data = await response.json();
        setTranslators(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error.message);
        setError('No se pudieron cargar los traductores.');
        setLoading(false);
      }
    };

    fetchTranslators();
  }, []);

  const indexOfLastTranslator = currentPage * translatorsPerPage;
  const indexOfFirstTranslator = indexOfLastTranslator - translatorsPerPage;
  const currentTranslators = translators.slice(indexOfFirstTranslator, indexOfLastTranslator);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(translators.length / translatorsPerPage);

  // Crear los elementos de paginación
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }

  if (loading) return <div className="loading-text">Cargando traductores...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="translators-page-container">
      <header className="translators-header">
        <h1 className="translators-title">Nuestros Traductores</h1>
        <p className="translators-subtitle">Explora los perfiles de nuestros talentosos traductores</p>
      </header>

      {/* Espacio para Anuncio */}
      <section className="ad-section my-4">
        <Container>
          <div className="ad-section-container">
            <ins className="adsbygoogle"
                 style={{ display: "block" }}
                 data-ad-client="ca-pub-3101266953328074"
                 data-ad-slot="6880835240"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </Container>
      </section>

      {/* Controles de Paginación en la parte superior */}
      <Pagination className="justify-content-center mb-4">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
        {paginationItems}
        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>

      <Row className="g-4">
        {currentTranslators.map((translator) => (
          <Col key={translator._id} sm={6} md={4} lg={3}>
            <Card className="translator-card">
              <Card.Img
                variant="top"
                src={translator.profilePhoto || 'https://via.placeholder.com/150'}
                className="translator-profile-photo"
                alt={`Foto de perfil de ${translator.username}`}
              />
              <Card.Body>
                <Card.Title className="translator-name">{translator.username}</Card.Title>
                <Card.Text className="translator-roles">
                  <strong>Roles:</strong> {translator.roles.join(', ')}
                </Card.Text>
                <Button
                  as={Link}
                  to={`/profileperson/${translator.username}`}
                  className="translator-profile-button"
                >
                  Ver Perfil
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Controles de Paginación en la parte inferior */}
      <Pagination className="justify-content-center mt-4">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
        {paginationItems}
        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
};

export default TranslatorsPage;