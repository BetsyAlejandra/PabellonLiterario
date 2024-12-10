import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Pagination } from 'react-bootstrap';
import '../styles/EditorsPage.css'; // Asegúrate de que la ruta es correcta

const EditorsPage = () => {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const editorsPerPage = 8;

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const response = await fetch('/api/users/editors'); // Ajusta la ruta de la API según tu backend
        if (!response.ok) {
          throw new Error('Error al obtener los editores');
        }
        const data = await response.json();
        setEditors(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error.message);
        setError('No se pudieron cargar los editores.');
        setLoading(false);
      }
    };

    fetchEditors();
  }, []);

  const indexOfLastEditor = currentPage * editorsPerPage;
  const indexOfFirstEditor = indexOfLastEditor - editorsPerPage;
  const currentEditors = editors.slice(indexOfFirstEditor, indexOfLastEditor);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(editors.length / editorsPerPage);

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

  if (loading) return <div className="loading-text">Cargando editores...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="editors-page-container">
      <header className="editors-header">
        <h1 className="editors-title">Nuestros Editores</h1>
        <p className="editors-subtitle">Explora los perfiles de nuestros talentosos editores</p>
      </header>
      <Container>
        {/* Controles de Paginación en la parte superior */}
        <Pagination className="justify-content-center mb-4">
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
          {paginationItems}
          <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>

        <Row className="g-4">
          {currentEditors.map((editor) => (
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
                  <Button
                    as={Link}
                    to={`/profileperson/${editor.username}`} // Ajusta la ruta si es necesario
                    className="editor-profile-button"
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
      </Container>
    </div>
  );
};

export default EditorsPage;