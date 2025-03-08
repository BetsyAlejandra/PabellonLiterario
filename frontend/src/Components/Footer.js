// src/components/Footer.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';

const Footer = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState({
    preguntas: false,
    unete: false,
    contactanos: false,
    politica: false,
    terminos: false,
  });

  const handleModal = (type, state) => {
    setShowModal((prev) => ({ ...prev, [type]: state }));
  };

  return (
    <footer className="custom-footer">
      <Container>
        <Row className="text-center footer-links-row">
          <Col>
            <a className="footer-link" onClick={() => navigate('/preguntas')}>
              Preguntas
            </a>
          </Col>
          <Col>
            <a className="footer-link" onClick={() => navigate('/unete')}>
              Únete a nosotros
            </a>
          </Col>
          <Col>
            <a className="footer-link" onClick={() => navigate('/contactanos')}>
              Contáctanos
            </a>
          </Col>
          <Col>
            <a className="footer-link" onClick={() => navigate('/politica')}>
              Política de Privacidad
            </a>
          </Col>
          <Col>
            <a className="footer-link" onClick={() => navigate('/terminos')}>
              Términos de Servicios
            </a>
          </Col>
          <Col>
            <a className="footer-link" onClick={() => navigate('/disclaimer')}>
              Disclaimer
            </a>
          </Col>
          <Col>
            <a className="footer-link" onClick={() => navigate('/sobrenosotros')}>
              Sobre Nosotros
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;