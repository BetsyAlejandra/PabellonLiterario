// src/components/FloatingButton.jsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaDonate } from 'react-icons/fa'; // Icono de "donar" de react-icons

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
      >
        <FaDonate />
      </Button>

      {/* Modal de Donaciones */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="donate-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-gold">Top Donadores de Ko-fi</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-dark">
          <p>Aquí puedes mostrar la lista de los donadores más recientes de Ko-fi...</p>
          {/* Agregar la lógica para mostrar los top donadores */}
          <Button
            variant="secondary"
            onClick={handleClose}
            className="modal-close-btn"
          >
            Cerrar
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FloatingButton;