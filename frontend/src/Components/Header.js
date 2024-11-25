import React, { useState, useEffect } from 'react';
import '../styles/components.css'; // Archivo CSS para personalización
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from 'react-bootstrap';
import logo from '../assets/Logo1.png';

const Header = () => {
  // Asumimos que la URL de la imagen de perfil proviene de un estado o API
  const [profilePic, setProfilePic] = useState('');

  // Simular obtener la URL de la imagen desde una API o una fuente externa
  useEffect(() => {
    // Aquí podrías realizar una solicitud para obtener la URL del perfil, por ejemplo:
    // setProfilePic('https://mi-servidor.com/path/a-la-imagen.jpg');

    // Para este ejemplo, se coloca una URL ficticia:
    setProfilePic('https://www.example.com/path/to/profile-pic.jpg');
  }, []);

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Logo a la izquierda */}
        <Navbar.Brand href="#home" className="logo">
          <img src={logo} alt="MiLogo" className="logo-img" />
        </Navbar.Brand>

        {/* Navegación principal y barra de búsqueda centrada */}
        <Navbar.Collapse id="navbarScroll" className="d-flex justify-content-center align-items-center w-100">
          <Nav className="me-auto justify-content-center">
            <Nav.Link href="#biblioteca" className="custom-link">Biblioteca</Nav.Link>
            <NavDropdown title="Género" id="navbarScrollingDropdown" className="custom-link">
              <NavDropdown.Item href="#abo">ABO</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#transmigracion" className="custom-link">Transmigración</Nav.Link>
            <Nav.Link href="#abo" className="custom-link">ABO</Nav.Link>
            <Nav.Link href="#xianxia" className="custom-link">Xianxia</Nav.Link>
            <Nav.Link href="#completamos" className="custom-link">Terminadas</Nav.Link>
          </Nav>

          {/* Barra de búsqueda centrada */}
          <Form className="d-flex justify-content-center">
            <FormControl
              type="search"
              placeholder="Buscar"
              className="me-2 search-input"
              aria-label="Buscar"
            />
            <Button className="search-button">🔍</Button>
          </Form>
        </Navbar.Collapse>

        {/* Perfil a la derecha con foto circular */}
        <Nav className="ms-auto">
          <Nav.Link href="#perfil" className="custom-link">
            {/* Solo muestra la imagen si está disponible */}
            {profilePic && (
              <img src={profilePic} alt="Perfil" className="rounded-circle" width="40" height="40" />
            )}
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
