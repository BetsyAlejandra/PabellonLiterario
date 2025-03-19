import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/components.css";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Footer = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const links = [
    { path: "/preguntas", label: "Preguntas" },
    { path: "/unete", label: "Únete a nosotros" },
    { path: "/contactanos", label: "Contáctanos" },
    { path: "/politica", label: "Política de Privacidad" },
    { path: "/terminos", label: "Términos de Servicio" },
    { path: "/disclaimer", label: "Disclaimer" },
    { path: "/sobrenosotros", label: "Sobre Nosotros" },
  ];

  return (
    <footer className="custom-footer">
      <Container>
        <Row className="text-center footer-links-row">
          {links.map(({ path, label }) => (
            <Col key={path}>
              <span
                className="footer-link"
                role="link"
                tabIndex="0"
                onClick={() => navigate(path)}
                onKeyDown={(e) => e.key === "Enter" && navigate(path)}
              >
                {label}
              </span>
            </Col>
          ))}
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;