import React, { useState, useEffect } from "react";
import "../styles/components.css"; // Archivo CSS para personalización
import axios from "axios";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Modal,
  Spinner,
  NavDropdown,
} from "react-bootstrap";
import logo from "../assets/logo.png"; // Logo de fantasía
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [userName, setUserName] = useState("Usuario");
  const [profilePic, setProfilePic] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true); // Estado para la visibilidad de la barra
  const [lastScrollPos, setLastScrollPos] = useState(0); // Guarda la última posición de scroll
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/profile", {
          withCredentials: true,
        });

        if (response.data) {
          const user = response.data;
          setProfilePic(
            user.profilePhoto || "https://via.placeholder.com/150"
          );
          setUserName(user.username || "Usuario");
          setUserRoles(user.roles || []);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(
          "Error al obtener los datos del usuario:",
          error.response?.data || error.message
        );
        setIsLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleSearchClick = async () => {
    const searchQuery = document.querySelector(".search-input").value.trim();

    if (searchQuery === "") {
      alert("Por favor, ingresa un término de búsqueda.");
      return;
    }

    try {
      const response = await axios.get(`/api/novels/search`, {
        params: { query: searchQuery },
        withCredentials: true,
      });
      const results = response.data;

      if (results.length === 0) {
        alert("No se encontraron resultados para tu búsqueda.");
      } else {
        navigate("/search-results", { state: { results } });
      }
    } catch (error) {
      console.error(
        "Error al buscar novelas:",
        error.response?.data || error.message
      );
      alert("Error al realizar la búsqueda.");
    }

    setShowSearchModal(false);
  };

  const handleUploadClick = () => {
    navigate("/upload");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setUserName("Inicia Sesión");
        setUserRoles([]);
        navigate("/");
        window.location.reload();
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al realizar el logout:", error);
    }
  };

  const hasRole = (roles) => {
    return roles.some((role) =>
      ["Traductor", "Escritor"].includes(role)
    );
  };

    // Manejo de la visibilidad del navbar
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollPos = window.scrollY;
  
        if (currentScrollPos > lastScrollPos && currentScrollPos > 50) {
          setIsNavbarVisible(false); // Oculta la barra al hacer scroll hacia abajo
        } else {
          setIsNavbarVisible(true); // Muestra la barra al hacer scroll hacia arriba
        }
  
        setLastScrollPos(currentScrollPos);
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [lastScrollPos]);

  return (
    <Navbar
      expand="lg"
      className={`custom-navbar ${isNavbarVisible ? "" : "navbar-hidden"}`} // Clase condicional
    >
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="logo"
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Logo" className="logo-img" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" className="custom-toggler" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Nav.Link
              as="div"
              className="custom-link"
              onClick={() => navigate("/")}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as="div"
              className="custom-link"
              onClick={() => navigate("/Novelas")}
            >
              Novelas
            </Nav.Link>
            {/* Menú Desplegable para Traductores y Editores */}
            <NavDropdown
              title="Roles" // Título del desplegable
              id="roles-dropdown"
              className="custom-link"
            >
              <NavDropdown.Item onClick={() => navigate("/traductores")}>
                Traductores
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/editores")}>
                Editores
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              as="div"
              className="custom-link"
              onClick={() => navigate("/generos")}
            >
              Géneros
            </Nav.Link>
            <Nav.Link
              as="div"
              className="custom-link"
              onClick={() => navigate("/postular")}
            >
              Postularme
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center">
            <Button
              className="search-icon me-2 custom-button"
              onClick={() => setShowSearchModal(true)}
            >
              <FaSearch />
            </Button>
            {isLoggedIn === null ? (
              <Spinner animation="border" variant="light" />
            ) : (
              <>
                {isLoggedIn && hasRole(userRoles) && (
                  <Button
                    className="upload-btn me-2 custom-button"
                    onClick={handleUploadClick}
                  >
                    Subir Novela
                  </Button>
                )}
                {isLoggedIn ? (
                  <>
                    <Nav.Link
                      as="div"
                      className="custom-link d-flex flex-column align-items-center me-2"
                      onClick={handleProfileClick}
                    >
                      <img
                        src={profilePic}
                        alt="Foto de perfil"
                        className="rounded-circle profile-pic"
                        width="40"
                        height="40"
                        style={{ cursor: "pointer" }}
                      />
                      <span className="ms-2 profile-name">{userName}</span>
                    </Nav.Link>
                    <Button
                      className="logout-btn custom-button"
                      variant="outline-danger"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="register-btn me-2 custom-button"
                      variant="outline-primary"
                      onClick={() => navigate("/register")}
                    >
                      Registrarse
                    </Button>
                    <Button
                      className="login-btn custom-button"
                      variant="primary"
                      onClick={() => navigate("/login")}
                    >
                      Iniciar Sesión
                    </Button>
                  </>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Modal de Búsqueda */}
      <Modal
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        className="search-modal-custom"
      >
        <Modal.Body className="search-modal">
          <Form className="d-flex justify-content-center">
            <FormControl
              type="search"
              placeholder="Buscar"
              className="me-2 search-input"
              aria-label="Buscar"
            />
            <Button
              variant="outline-secondary"
              onClick={handleSearchClick}
              className="search-button"
            >
              Buscar
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setShowSearchModal(false)}
              className="ms-2 close-button"
            >
              Cerrar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default Header;