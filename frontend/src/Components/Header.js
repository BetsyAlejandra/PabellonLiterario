import React, { useState, useEffect, useMemo, useContext } from "react";
import { Navbar, Nav, Container, Form, FormControl, Button, Spinner, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";
import "../styles/components.css";
import logo from "../assets/logon.png";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const { darkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isNavbarMounted, setIsNavbarMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  // Detecta interacción del usuario antes de cargar el Navbar
  useEffect(() => {
    const onUserInteraction = () => {
      setIsNavbarMounted(true);
      window.removeEventListener("mousemove", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
    };

    window.addEventListener("mousemove", onUserInteraction);
    window.addEventListener("touchstart", onUserInteraction);

    return () => {
      window.removeEventListener("mousemove", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
    };
  }, []);

  // Manejar cambio de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Extraer datos del usuario
  const userName = user?.username || "Usuario";
  const profilePic = user?.profilePhoto || "https://via.placeholder.com/150";
  const userRoles = useMemo(() => user?.roles || [], [user]);
  const canUpload = useMemo(() => userRoles.some(role => ["Traductor", "Escritor"].includes(role)), [userRoles]);

  const handleProfileClick = () => navigate(user ? "/profile" : "/login");
  const handleUploadClick = () => navigate("/upload");

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const response = await axios.get(`/api/novels/search?query=${searchQuery}`);
      navigate("/search-results", { state: { results: response.data.novels, query: searchQuery } });
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  if (!isNavbarMounted) return null;

  return (
    <Navbar expand="lg" className={`custom-navbar ${darkMode ? "dark-mode" : ""}`}>
      <Container className="d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Navbar.Brand onClick={() => navigate("/")} className="logo" style={{ cursor: "pointer" }}>
          <img src={logo} alt="Logo" className="logo-img" loading="lazy" width="120" height="40" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" className="custom-toggler" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate("/Novelas")}>Novelas</Nav.Link>
            <Nav.Link onClick={() => navigate("/audiodramas")}>Audio Dramas</Nav.Link>
            <Nav.Link onClick={() => navigate("/manhuas")}>Manhuas</Nav.Link>
            <NavDropdown title="Roles" id="roles-dropdown">
              <NavDropdown.Item onClick={() => navigate("/traductores")}>Traductores</NavDropdown.Item>
              <NavDropdown.Item onClick={() => navigate("/editores")}>Editores</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link onClick={() => navigate("/postular")}>Postularme</Nav.Link>
          </Nav>

          {/* Barra de búsqueda */}
          <Form className="d-flex search-form flex-nowrap" onSubmit={handleSearch} style={{ maxWidth: "300px" }}>
            <FormControl
              type="search"
              placeholder="Buscar novela..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: "200px" }}
            />
            <Button variant="outline-dark" type="submit" disabled={searchLoading}>
              {searchLoading ? <Spinner animation="border" size="sm" /> : "Buscar"}
            </Button>
          </Form>

          {/* Perfil del usuario */}
          <Nav className="ms-auto d-flex align-items-center profile-container">
            {user ? (
              <div className="d-flex align-items-center profile-section">
                <Nav.Link onClick={handleProfileClick} className="d-flex align-items-center">
                  <img src={profilePic} alt="Foto de perfil" className="rounded-circle profile-pic" width="40" height="40" loading="lazy" />
                  <span className="profile-name">{userName}</span>
                </Nav.Link>

                {isDesktop && (
                  <div className="d-flex flex-column button-group">
                    {canUpload && <Button className="upload-btn custom-button" onClick={handleUploadClick}>Subir Novela</Button>}
                    <Button className="logout-btn custom-button" variant="outline-danger" onClick={handleLogout}>Cerrar Sesión</Button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="primary" onClick={() => navigate("/login")}>Iniciar Sesión</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;