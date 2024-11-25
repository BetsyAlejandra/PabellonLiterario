import React, { useState, useEffect } from 'react';
import '../styles/components.css'; // Archivo CSS para personalización
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from 'react-bootstrap';
import logo from '../assets/Logo1.png';

const Header = () => {
  const [profilePic, setProfilePic] = useState('');
  const [userName, setUserName] = useState('Usuario');

  useEffect(() => {
    // Aquí podrías hacer una solicitud para obtener la URL del perfil, por ejemplo:
    setProfilePic('https://www.example.com/path/to/profile-pic.jpg');
  }, []);

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Logo a la izquierda */}
        <Navbar.Brand href="#home" className="logo">
          <img src={logo} alt="MiLogo" className="logo-img" />
        </Navbar.Brand>

        {/* Menú hamburguesa (icono) en la misma línea que el logo */}
        <Navbar.Toggle aria-controls="navbarScroll" className="custom-toggler" />

        {/* Contenido del menú (se colapsa en pantallas pequeñas) */}
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto justify-content-center w-100">
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
      </Container>

      {/* Perfil y nombre del usuario fuera del menú hamburguesa */}
      <Nav className="ms-auto profile-nav">
        <Nav.Link href="#perfil" className="custom-link d-flex align-items-center">
          {/* Imagen de perfil */}
          {profilePic && (
            <img src={profilePic} alt="Perfil" className="rounded-circle" width="40" height="40" />
          )}
          {/* Nombre del usuario */}
          <span className="ms-2">{userName}</span>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Header;
