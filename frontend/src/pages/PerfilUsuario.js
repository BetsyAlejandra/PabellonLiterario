import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Nav } from 'react-bootstrap';
import axios from 'axios';
import decorativeImage from '../assets/decoracion.png'; // Imagen encima de la foto de perfil
import '../styles/perfilUsuarioStyles.css'; // Importa el archivo CSS

const PerfilUsuario = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('translations'); // Tab activa
  const itemsPerPage = 3; // Número de elementos por página

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/profileperson/${username}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el perfil público:', error);
        setError('Usuario no encontrado.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <div className="text-center text-light">Cargando perfil...</div>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  const isTranslator = user.roles && user.roles.includes('Traductor');

  const data = {
    translations: user.translatedWorks || [],
    posts: user.posts || [],
    recommendations: user.recommendations || [],
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data[activeTab].slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil((data[activeTab]?.length || 0) / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reinicia la paginación
  };

  return (
    <div className="user-profile container my-5">
      {/* Sección de cabecera del perfil */}
      <div className="user-header text-center">
        <div className="profile-img-container">
          <img
            src={decorativeImage}
            alt="Decoración"
            className="profile-moon-image"
          />
          <img
            src={user.profilePhoto || 'https://via.placeholder.com/150'}
            alt={`Imagen de perfil de ${user.username}`}
            className="profile-photo"
          />
        </div>
        <h3 className="user-name">{user.username}</h3>
        <p className="user-role">
          <strong>Roles:</strong> {user.roles.join(', ')}
        </p>
        <p className="user-description">
          {user.description || 'Sin descripción'}
        </p>
      </div>

      {/* Pestañas */}
      <Nav variant="tabs" className="justify-content-center my-4">
        <Nav.Item>
          <Nav.Link
            onClick={() => handleTabChange('translations')}
            className={activeTab === 'translations' ? 'active' : ''}
          >
            Traducciones
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => handleTabChange('posts')}
            className={activeTab === 'posts' ? 'active' : ''}
          >
            Posts
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => handleTabChange('recommendations')}
            className={activeTab === 'recommendations' ? 'active' : ''}
          >
            Recomendaciones
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Contenido del Tab Activo */}
      <div className="translated-works-section">
        <h4 className="section-title">{activeTab === 'translations' ? 'Traducciones' : activeTab === 'posts' ? 'Posts' : 'Recomendaciones'}</h4>
        {currentItems.length > 0 ? (
          <>
            <Row className="translated-works-grid">
              {currentItems.map((item, index) => (
                <Col md={4} key={index} className="mb-4">
                  <Card className="translated-work-card">
                    <Card.Img
                      variant="top"
                      src={item.coverImage || 'https://via.placeholder.com/150'}
                      alt={item.title || 'Sin título'}
                      className="translated-work-img"
                    />
                    <Card.Body>
                      <Card.Title>{item.title || 'Sin título'}</Card.Title>
                      <Card.Text>{item.description || 'Sin descripción'}</Card.Text>
                      <Button
                        variant="outline-light"
                        href={`/story-detail/${item.id || '#'}`}
                      >
                        Ver más
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Paginación */}
            <div className="pagination-container text-center mt-4">
              <Button
                variant="outline-light"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="mx-1"
              >
                &laquo;
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  className={`mx-1 ${page === currentPage ? 'active' : ''}`}
                  variant="outline-light"
                  onClick={() => paginate(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline-light"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="mx-1"
              >
                &raquo;
              </Button>
            </div>
          </>
        ) : (
          <p className="text-light text-center">No hay datos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default PerfilUsuario;