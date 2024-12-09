import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import '../styles/TranslatorsPage.css';
import decorativeImage from '../assets/decoracion.png'; // Decoración fantasiosa

const TranslatorsPage = () => {
  const [translators, setTranslators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div className="loading-text">Cargando traductores...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="translators-page-container">
      <header className="translators-header">
        <img src={decorativeImage} alt="Decoración" className="decorative-header-image" />
        <h1 className="translators-title">Nuestros Traductores</h1>
        <p className="translators-subtitle">Explora los perfiles de nuestros talentosos traductores</p>
      </header>
      <Container>
        <Row className="g-4">
          {translators.map((translator) => (
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
      </Container>
    </div>
  );
};

export default TranslatorsPage;