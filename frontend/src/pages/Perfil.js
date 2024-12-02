import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const mockData = {
  123: {
    name: "Kiki",
    profilePic: "https://via.placeholder.com/150",
    translatedWorks: [
      { id: 1, title: "TGCF", coverImage: "https://via.placeholder.com/300" },
      { id: 2, title: "TGCF", coverImage: "https://via.placeholder.com/300" },
      { id: 3, title: "TGCF", coverImage: "https://via.placeholder.com/300" },
      { id: 4, title: "TGCF", coverImage: "https://via.placeholder.com/300" },
      { id: 5, title: "TGCF", coverImage: "https://via.placeholder.com/300" },
    ],
    booksRead: [
      { id: 1, title: "MDSZ", coverImage: "https://via.placeholder.com/300" },
      { id: 2, title: "SVSSS", coverImage: "https://via.placeholder.com/300" },
    ],
  },

};

const Perfil = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('traducciones');

  useEffect(() => {
    const fetchUser = async () => {
      if (mockData[id]) {
        setUser(mockData[id]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/?`);
        if (!response.ok) throw new Error('Usuario no encontrado');
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <p className="text-center text-light">Cargando perfil...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">Usuario no encontrado.</p>;
  }

  // renderizando la seccion de la biblioteca
  const renderSection = () => {
    if (activeSection === 'traducciones') {
      return (
        <Row>
          {user.translatedWorks.length === 0 ? (<p className="text-light text-center">No hay nada aqui.</p>) :
           (user.translatedWorks.map((work) => (
              <Col md={4} lg={3} key={work.id} className="mb-4">
                <Card className="bg-dark text-light">
                  <Card.Img variant="top" src={work.coverImage} alt={`Portada de ${work.title}`} />
                  <Card.Body>
                    <Card.Title>{work.title}</Card.Title>
                    <Button variant="outline-light" href={`/novela?`}>
                      Editar
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      );
    } else if (activeSection === 'biblioteca') {
      return (
        <Row>
          {user.booksRead.length === 0 ? (<p className="text-light text-center">No hay nada aqui.</p>) : 
          ( user.booksRead.map((book) => (
              <Col md={4} lg={3} key={book.id} className="mb-4">
                <Card className="bg-dark text-light">
                  <Card.Img variant="top" src={book.coverImage} alt={`Portada de ${book.title}`} />
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Button variant="outline-light" href={`/novela?`}>
                      Ver más
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      );
    }
  };

  return (
    <div className="user-profile">
      <Container>
        {/* Info del User*/}
        <Row className="align-items-center justify-content-center py-5">
          <Col xs={12} md={4} className="text-center">
            <img src={user.profilePic || 'https://via.placeholder.com/150'} alt={`Imagen de perfil de ${user.name}`} className="rounded-circle img-fluid"/>
          </Col>
          <Col xs={12} md={8} className="text-center text-light">
            <section className="user-library-count">
              {/* Muestra la cantidad de libros,traducciones,seguidores */}
              <Row className="justify-content-center py-3">
                <h3 className="mb-2">{user.name}</h3>
                <Col xs={12} md={4}>
                  <div className="stat-card">
                    <h6 className="text-light">Traducciones</h6>
                    <p className="text-light">{user.translatedWorks.length}</p>
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="stat-card">
                    <h6 className="text-light">Biblioteca</h6>
                    <p className="text-light">{user.booksRead.length}</p> 
                  </div>
                </Col>
              </Row>
            </section>
            <Button variant="outline-light" href={`/editPerfil?`}>
              Editar
            </Button>
          </Col>
        </Row>

        {/* Botones para ver las obras*/}
        <div className="text-left mb-4">
          <Button
            className={`custom-button ${activeSection === 'traducciones' ? 'active' : ''}`} onClick={() => setActiveSection('traducciones')}>
            Traducciones
          </Button>
          <Button
            className={`custom-button ${activeSection === 'biblioteca' ? 'active' : ''}`} onClick={() => setActiveSection('biblioteca')}>
            Biblioteca
          </Button>
        </div>

        {/* renderizar las obras*/}
        {renderSection()}
      </Container>
    </div >
  );
};

export default Perfil;
