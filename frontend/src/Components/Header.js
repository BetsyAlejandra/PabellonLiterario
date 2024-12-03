import React, { useState, useEffect } from 'react';
import '../styles/components.css';
import axios from 'axios';
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button, Modal, Spinner } from 'react-bootstrap';
import logo from '../assets/Logo1.png';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [userName, setUserName] = useState('Usuario');
  const [profilePic, setProfilePic] = useState('');
  const [userRole, setUserRole] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          withCredentials: true,
        });

        if (response.data) {
          const user = response.data;
          setProfilePic(user.profilePhoto || 'https://via.placeholder.com/150');
          setUserName(user.username || 'Usuario');
          setUserRole(user.roles || []); // manejar roles como un array
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error.response?.data || error.message);
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleSearchClick = async () => {
    const searchQuery = document.querySelector('.search-input').value.trim();
  
    if (searchQuery === '') {
      alert('Por favor, ingresa un término de búsqueda.');
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/api/novels/search`, {
        params: { query: searchQuery }, // Forma segura de pasar parámetros
        withCredentials: true, // Si estás usando cookies para la sesión
      });
      const results = response.data;
  
      if (results.length === 0) {
        alert('No se encontraron resultados para tu búsqueda.');
      } else {
        navigate('/search-results', { state: { results } });
      }
    } catch (error) {
      console.error('Error al buscar novelas:', error.response?.data || error.message);
      alert('Error al realizar la búsqueda.');
    }
  
    setShowSearchModal(false);
  };  
  


  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include', // Asegura que las cookies sean enviadas
      });
      if (response.ok) {
        setIsLoggedIn(false); // Cambia el estado a falso cuando el usuario cierre sesión
        setUserName('Inicia Sesión');
        setUserRole([]);
        navigate('/');
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al realizar el logout:', error);
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand onClick={() => navigate('/')} className="logo" style={{ cursor: 'pointer' }}>
          <img src={logo} alt="MiLogo" className="logo-img" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" className="custom-toggler" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto profile-nav">
            <Nav.Link as="div" className="custom-link d-flex flex-column align-items-center" onClick={handleProfileClick}>
              <img
                src={profilePic}
                alt="Foto de perfil"
                className="rounded-circle"
                width="40"
                height="40"
                style={{ cursor: 'pointer' }}
              />
              <span className="ms-2">{userName}</span>
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto w-100">
            <Nav.Link as="div" className="custom-link" onClick={() => navigate('/')}>Home</Nav.Link>
          </Nav>
          <Button className="search-icon" onClick={() => setShowSearchModal(true)}>
            <FaSearch />
          </Button>
          {isLoggedIn === null ? (
            <Spinner animation="border" />
          ) : (
            
            <>
              {isLoggedIn && userRole.includes('Traductor') && (
                
                <Button className="upload-btn" onClick={handleUploadClick}>
                  Subir Novela
                </Button>
              )}
              {isLoggedIn && (
                <Button className="logout-btn" variant="outline-danger" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              )}
            </>
          )}
        </Navbar.Collapse>
      </Container>

      <Modal show={showSearchModal} onHide={() => setShowSearchModal(false)} centered backdrop="static" keyboard={false}>
        <Modal.Body className="search-modal">
          <Form className="d-flex justify-content-center">
            <FormControl type="search" placeholder="Buscar" className="me-2 search-input" aria-label="Buscar" />
            <Button variant="outline-secondary" onClick={handleSearchClick}>Buscar</Button>
            <Button variant="outline-secondary" onClick={() => setShowSearchModal(false)}>Cerrar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default Header;