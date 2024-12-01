import React, { useState, useEffect } from 'react';
import '../styles/components.css';
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button, Modal, Spinner } from 'react-bootstrap';
import logo from '../assets/Logo1.png';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [profilePic, setProfilePic] = useState('');
  const [userName, setUserName] = useState('Usuario');
  const [userRole, setUserRole] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/perfil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Incluye las cookies
        });

        if (response.ok) {
          const user = await response.json();
          setProfilePic(user.profilePhoto || 'https://defaultimage.com/profile.jpg');
          setUserName(user.username);
          setUserRole(user.role);
          setIsLoggedIn(true);
        } else {
          console.error('Error al obtener los datos del usuario:', response.status, response.statusText);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        setIsLoggedIn(false);
      }
    };

    if (isLoggedIn === null) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleSearchClick = () => {
    const searchQuery = document.querySelector('.search-input').value;
    navigate(`/search?query=${searchQuery}`);
    setShowSearchModal(false);
  };

  const handleLibraryClick = () => {
    navigate('/libreria');
  };

  const handleUploadClick = () => {
    navigate('/my-stories');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Asegura que las cookies sean enviadas
      });
      if (response.ok) {
        setIsLoggedIn(false); // Cambia el estado a falso cuando el usuario cierre sesión
        setProfilePic('https://as2.ftcdn.net/jpg/02/15/84/43/220_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg');
        setUserName('Inicia Sesión');
        setUserRole('');
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
                alt="Perfil"
                className="rounded-circle"
                width="40"
                height="40"
                style={{ cursor: 'pointer' }}
              />
              <span className="ms-2">{userName}</span>
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto w-100">
            <Nav.Link as="div" className="custom-link" onClick={handleLibraryClick}>Biblioteca</Nav.Link>
            <NavDropdown title="Género" id="navbarScrollingDropdown" className="custom-link">
              <NavDropdown.Item onClick={() => navigate('/genero/abo')}>ABO</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as="div" className="custom-link" onClick={() => navigate('/genero/transmigracion')}>Transmigración</Nav.Link>
            <Nav.Link as="div" className="custom-link" onClick={() => navigate('/genero/xianxia')}>Xianxia</Nav.Link>
            <Nav.Link as="div" className="custom-link" onClick={() => navigate('/completamos')}>Terminadas</Nav.Link>
          </Nav>
          <Button className="search-icon" onClick={() => setShowSearchModal(true)}>
            <FaSearch />
          </Button>
          {isLoggedIn === null ? (
            <Spinner animation="border" />
          ) : (
            <>
              {isLoggedIn && userRole === 'Traductor' && (
                <Button className="upload-btn" onClick={handleUploadClick}>+ Subir</Button>
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