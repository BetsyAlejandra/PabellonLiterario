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
import logo from "../assets/logon.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [userName, setUserName] = useState("Usuario");
  const [profilePic, setProfilePic] = useState("");
  const [userRoles, setUserRoles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/profile", {
          withCredentials: true,
        });

        if (response.data) {
          const user = response.data;
          setProfilePic(user.profilePhoto || "https://via.placeholder.com/150");
          setUserName(user.username || "Usuario");
          setUserRoles(user.roles || []);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error.response?.data || error.message);
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
    return roles.some((role) => ["Traductor", "Escritor"].includes(role));
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos > lastScrollPos && currentScrollPos > 50) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }

      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPos]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const response = await axios.get(`/api/novels/search?query=${searchQuery}`);
      setSearchResults(response.data.novels);
      navigate("/search-results", { state: { results: response.data.novels, query: searchQuery } });
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <Navbar expand="lg" className={`custom-navbar ${isNavbarVisible ? "" : "navbar-hidden"}`}>
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand onClick={() => navigate("/")} className="logo" style={{ cursor: "pointer" }}>
          <img src={logo} alt="Logo" className="logo-img" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" className="custom-toggler" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Nav.Link as="div" className="custom-link" onClick={() => navigate("/")}>Home</Nav.Link>
            <Nav.Link as="div" className="custom-link" onClick={() => navigate("/Novelas")}>Novelas</Nav.Link>
            <Nav.Link as="div" className="custom-link" onClick={() => navigate("/audiodramas")}>Audio Dramas</Nav.Link>
            <NavDropdown title="Roles" id="roles-dropdown" className="custom-link">
              <NavDropdown.Item onClick={() => navigate("/traductores")}>Traductores</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/editores")}>Editores</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as="div" className="custom-link" onClick={() => navigate("/postular")}>Postularme</Nav.Link>
          </Nav>

          <Form className="d-flex" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Buscar novela..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-light" type="submit" disabled={searchLoading}>
              {searchLoading ? <Spinner animation="border" size="sm" /> : "Buscar"}
            </Button>
          </Form>

          <Nav className="ms-auto align-items-center">
            {isLoggedIn === null ? (
              <Spinner animation="border" variant="light" />
            ) : (
              <>
                {isLoggedIn && hasRole(userRoles) && (
                  <Button className="upload-btn me-2 custom-button" onClick={handleUploadClick}>Subir Novela</Button>
                )}
                {isLoggedIn ? (
                  <>
                    <Nav.Link as="div" className="custom-link d-flex flex-column align-items-center me-2" onClick={handleProfileClick}>
                      <img src={profilePic} alt="Foto de perfil" className="rounded-circle profile-pic" width="40" height="40" style={{ cursor: "pointer" }} />
                      <span className="ms-2 profile-name">{userName}</span>
                    </Nav.Link>
                    <Button className="logout-btn custom-button" variant="outline-danger" onClick={handleLogout}>Cerrar Sesión</Button>
                  </>
                ) : (
                  <>
                    <Button className="register-btn me-2 custom-button" variant="outline-primary" onClick={() => navigate("/register")}>Registrarse</Button>
                    <Button className="login-btn custom-button" variant="primary" onClick={() => navigate("/login")}>Iniciar Sesión</Button>
                  </>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;