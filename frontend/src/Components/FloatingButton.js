import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { FaDonate } from 'react-icons/fa'; // Icono de "donar" de react-icons
import axios from 'axios'; 
import '../styles/components.css'; 

const FloatingButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('top'); // 'top' o 'recent'

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const fetchDonations = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/donations/${type}`);
      setDonations(response.data);
    } catch (err) {
      console.error('Error al obtener las donaciones:', err);
      setError('No se pudieron cargar las donaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchDonations(viewType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, viewType]);

  const handleViewChange = (val) => {
    setViewType(val);
  };

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
          <Modal.Title className="modal-title-gold">Donaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-dark">
          {/* Opciones para cambiar la vista */}
          <ToggleButtonGroup
            type="radio"
            name="viewOptions"
            defaultValue="top"
            onChange={handleViewChange}
            className="mb-3"
          >
            <ToggleButton id="tbg-radio-1" value="top" variant="outline-success">
              Top Donadores
            </ToggleButton>
            <ToggleButton id="tbg-radio-2" value="recent" variant="outline-primary">
              Donaciones Recientes
            </ToggleButton>
          </ToggleButtonGroup>

          {loading && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && donations.length === 0 && (
            <p>No hay donaciones para mostrar.</p>
          )}

          {!loading && !error && donations.length > 0 && (
            <div>
              {viewType === 'top' ? (
                <ul className="list-group">
                  {donations.map((donor, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {donor.name}
                      <span className="badge bg-primary rounded-pill">
                        ${donor.total.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="list-group">
                  {donations.map((donation, index) => (
                    <li key={index} className="list-group-item">
                      <strong>{donation.fromName}</strong> donó <strong>${donation.amount.toFixed(2)}</strong>
                      {donation.message && <p>"{donation.message}"</p>}
                      <small className="text-muted">{new Date(donation.timestamp).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="mt-3 text-end">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="modal-close-btn"
            >
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FloatingButton;