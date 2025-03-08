import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col, Pagination } from 'react-bootstrap';
import '../styles/TranslatorsPage.css';

const TranslatorsPage = () => {
  const [translators, setTranslators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de paginación
  const translatorsPerPage = 8;
  const initialPage = parseInt(localStorage.getItem('currentPage')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll automático al cambiar de página
    localStorage.setItem('currentPage', currentPage); // Guardar página actual en localStorage
  }, [currentPage]);

  const indexOfLastTranslator = currentPage * translatorsPerPage;
  const indexOfFirstTranslator = indexOfLastTranslator - translatorsPerPage;
  const currentTranslators = translators.slice(indexOfFirstTranslator, indexOfLastTranslator);
  const totalPages = Math.ceil(translators.length / translatorsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    if (
      number === 1 ||
      number === totalPages ||
      (number >= currentPage - 1 && number <= currentPage + 1)
    ) {
      paginationItems.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    } else if (
      (number === currentPage - 2 && number > 1) ||
      (number === currentPage + 2 && number < totalPages)
    ) {
      paginationItems.push(<Pagination.Ellipsis key={`ellipsis-${number}`} />);
    }
  }

  if (loading) return <div className="loading-text">Cargando traductores...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="translators-page-container">
      <header className="translators-header">
        <h1 className="translators-title">Nuestros Traductores</h1>
        <p className="translators-subtitle">Explora los perfiles de nuestros talentosos traductores</p>
      </header>

      {/* Paginación superior */}
      <Pagination className="justify-content-center mb-4">
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {paginationItems}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
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

      {/* Paginación inferior */}
      <Pagination className="justify-content-center mt-4">
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {paginationItems}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
};

export default TranslatorsPage;