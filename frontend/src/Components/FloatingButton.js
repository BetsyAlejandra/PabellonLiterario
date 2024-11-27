import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaDonate } from 'react-icons/fa'; // Icono de "donar" de react-icons

const FloatingButton = () => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      {/* Botón flotante de Ko-fi */}
      <Button
        onClick={handleShow}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#FF5F1F', // Color de Ko-fi
          border: 'none',
          borderRadius: '50%', // Asegura que el botón sea redondo
          width: '60px', // Ajusta el tamaño del botón
          height: '60px', // Ajusta el tamaño del botón
          padding: '0', // Elimina el padding para que el botón sea perfectamente redondo
          fontSize: '30px', // Ajusta el tamaño del icono
          color: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        <FaDonate />
      </Button>

      {/* Modal con Fondo Negro */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: 'black', color: 'white' }}>
          <h5>Top Donadores de Ko-fi</h5>
          <p>Aquí puedes mostrar la lista de los donadores más recientes de Ko-fi...</p>
          {/* Agregar la lógica para mostrar los top donadores */}
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FloatingButton;