import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Pagination } from 'react-bootstrap';
import '../styles/EditorsPage.css';

const EditorsPage = () => {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const editorsPerPage = 8;
  const totalPages = Math.ceil(editors.length / editorsPerPage);
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const response = await fetch('/api/users/editors');
        if (!response.ok) {
          throw new Error('Error al obtener los editores');
        }
        const data = await response.json();
        setEditors(data);
      } catch (error) {
        console.error('Error:', error.message);
        setError('No se pudieron cargar los editores.');
      } finally {
        setLoading(false);
      }
    };

    fetchEditors();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll automático cuando cambia de página
  }, [currentPage]);

  const handlePageChange = (page) => {
    setSearchParams({ page });
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

  if (loading) return <div className="loading-text">Cargando editores...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="editors-page-container">
      <header className="editors-header">
        <h1 className="editors-title">Nuestros Editores</h1>
        <p className="editors-subtitle">Explora los perfiles de nuestros talentosos editores</p>
      </header>
      <Container>
        <Pagination className="justify-content-center mb-4">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {paginationItems}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>

        <Row className="g-4">
          {editors.slice((currentPage - 1) * editorsPerPage, currentPage * editorsPerPage).map((editor) => (
            <Col key={editor._id} sm={6} md={4} lg={3}>
              <Card className="editor-card">
                <Card.Img
                  variant="top"
                  src={editor.profilePhoto || 'https://via.placeholder.com/150'}
                  className="editor-profile-photo"
                  alt={`Foto de perfil de ${editor.username}`}
                />
                <Card.Body>
                  <Card.Title className="editor-name">{editor.username}</Card.Title>
                  <Card.Text className="editor-roles">
                    <strong>Roles:</strong> {editor.roles.join(', ')}
                  </Card.Text>
                  <Button as={Link} to={`/profileperson/${editor.username}`} className="editor-profile-button">
                    Ver Perfil
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Pagination className="justify-content-center mt-4">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {paginationItems}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </Container>
    </div>
  );
};

export default EditorsPage;