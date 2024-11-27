import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/components.css'; // Importar el archivo de estilos

const Footer = () => {
  return (
    <footer className="custom-footer">
      <Container>
        <Row className="text-center">
          <Col>
            <a href="#home" className="footer-link">Home</a>
          </Col>
          <Col>
            <a href="#preguntas" className="footer-link">Preguntas</a>
          </Col>
          <Col>
            <a href="#unete" className="footer-link">Únete a nosotros</a>
          </Col>
          <Col>
            <a href="#contactanos" className="footer-link">Contáctanos</a>
          </Col>
          <Col>
            <a href="#politica" className="footer-link">Política de Privacidad</a>
          </Col>
          <Col>
            <a href="#terminos" className="footer-link">Términos de Servicios</a>
          </Col>
        </Row>
        <Row className="text-center mt-3">
          <Col>
            <p className="footer-rights">Pabellón Literario © 2024. Todos los derechos reservados</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
