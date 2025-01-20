import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { FaDonate } from 'react-icons/fa'; // Icono de "donar" de react-icons
import axios from 'axios'; 
import '../styles/components.css'; 

const FloatingButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      {/* Botón flotante de Donación */}
      <Button
        onClick={handleShow}
        className="floating-donate-btn"
        variant="primary"
      >
        <FaDonate size={30} />
      </Button>

      {/* Modal de Donaciones */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="donate-modal"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-gold">Apoya Nuestro Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-dark">
          <p>Si deseas apoyarnos, puedes hacerlo a través de las siguientes plataformas:</p>
          <div className="d-flex flex-column align-items-center">
            <Button
              variant="outline-primary"
              className="mb-3 w-75"
              href="https://paypal.me/betsyalejandramoreno?country.x=CO&locale.x=es_XC"
              target="_blank"
              rel="noopener noreferrer"
            >
              Donar con PayPal
            </Button>
            <Button
              variant="outline-success"
              className="mb-3 w-75"
              href="https://ko-fi.com/betsyalejandra"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apóyanos en Ko-Fi
            </Button>
            <Button
              variant="outline-danger"
              className="w-75"
              href="https://patreon.com/pabellonliterario?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Conviértete en Patreon
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className="modal-close-btn">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FloatingButton;