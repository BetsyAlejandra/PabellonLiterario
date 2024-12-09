import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import '../styles/perfilUsuarioStyles.css'; // Importa el archivo CSS

const PerfilUsuario = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Número de traducciones por página

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

  // Cálculo de los elementos para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTranslatedWorks = isTranslator && user.translatedWorks
    ? user.translatedWorks.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const totalPages = Math.ceil((user.translatedWorks?.length || 0) / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-profile container my-5">
      <Row className="justify-content-center">
        {/* Elementos fantásticos */}
        <img
          src="../assets/foto encima.png"
          alt="Moon Fantasy Element"
          className="fantasy-elements"
        />
        <Col md={5} className="mb-4">
          <Card>
            <Card.Body className="text-center">
              <img
                src={user.profilePhoto || 'https://via.placeholder.com/150'}
                alt={`Imagen de perfil de ${user.username}`}
                className="rounded-circle img-fluid mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h3 className="mb-2">{user.username}</h3>
              {user.roles && user.roles.length > 0 && (
                <p>
                  <strong>Roles:</strong> {user.roles.join(', ')}
                </p>
              )}
              <p>{user.description || 'Sin descripción'}</p>
              {user.socialLinks && user.socialLinks.length > 0 && (
                <div className="my-3">
                  <h5>Redes Sociales:</h5>
                  {user.socialLinks.map((link, index) => (
                    <p key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light"
                      >
                        {link}
                      </a>
                    </p>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={7} className="mb-4">
          <Card>
            <Card.Body>
              <h4 className="mb-4">Traducciones</h4>
              {isTranslator && user.translatedWorks && user.translatedWorks.length > 0 ? (
                <>
                  <Row>
                    {currentTranslatedWorks.map((work) => (
                      <Col md={6} lg={4} key={work.id} className="mb-4">
                        <Card className="translated-works">
                          <Card.Img
                            variant="top"
                            src={work.coverImage}
                            alt={`Portada de ${work.title}`}
                          />
                          <Card.Body>
                            <Card.Title>{work.title}</Card.Title>
                            <Button variant="outline-light" href={`/story-detail/${work.id}`}>
                              Ver historia
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Paginación */}
                  <div className="pagination-container text-center mt-4">
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
                  </div>
                </>
              ) : isTranslator ? (
                <p className="text-light text-center">No hay traducciones disponibles.</p>
              ) : (
                <p className="text-light text-center">
                  Este usuario no es Traductor, no hay traducciones para mostrar.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PerfilUsuario;