import React from 'react';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Contactanos = () => {
  return (
    <div style={{ background: '#D7E2E9', padding: '40px', minHeight: '100vh' }}>
      <Helmet>
        <title>Contáctanos | Pabellón Literario</title>
        <meta name="description" content="Ponte en contacto con Pabellón Literario para cualquier duda o solicitud." />
      </Helmet>
      <Container>
        <h1 className="text-center" style={{ color: '#D6B4A1' }}>Contáctanos</h1>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <p className="text-center" style={{ color: '#5A4A42' }}>
              Si tienes alguna pregunta, inquietud o deseas solicitar la eliminación de una obra, no dudes en ponerte en contacto con nosotros.
            </p>
            <p className="text-center" style={{ color: '#5A4A42' }}>
              Puedes comunicarte con nosotros a través del siguiente formulario o unirte a nuestro servidor de Discord para obtener una respuesta más rápida.
            </p>
            <p className="text-center" style={{ color: '#5A4A42' }}>
              Correo electrónico: <a href="pabellonliterario196@gmail.com" style={{ textDecoration: 'underline' }}>contacto@pabellonliterario.com</a>
            </p>
            <p className="text-center" style={{ color: '#5A4A42' }}>
              Servidor de Discord: <a href="https://discord.gg/Np8prZDgwX" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Únete aquí</a>
            </p>
            <Form>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" placeholder="Ingresa tu nombre" required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" placeholder="Ingresa tu correo electrónico" required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formMessage">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="Escribe tu mensaje" required />
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" type="submit" style={{ background: '#D6B4A1', border: 'none' }}>
                  Enviar
                </Button>
              </div>
            </Form>
            <p className="text-center mt-4" style={{ color: '#5A4A42' }}>
              Responderemos lo antes posible. ¡Gracias por ponerte en contacto con Pabellón Literario!
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contactanos;