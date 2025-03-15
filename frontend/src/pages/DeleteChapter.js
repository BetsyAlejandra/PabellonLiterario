import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Alert, Spinner, Modal } from "react-bootstrap";
import '../styles/DeleteChapter.css'

const DeleteChapter = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();

  const [chapterTitle, setChapterTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const { data } = await axios.get(`/api/manhuas/${id}/chapters/${chapterId}`);
        setChapterTitle(data.title);
      } catch (error) {
        console.error("Error al obtener el capítulo:", error);
        setError("No se pudo cargar el capítulo.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [id, chapterId]);

  // Eliminar capítulo
  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      await axios.delete(`/api/manhuas/${id}/chapters/${chapterId}`);
      navigate(`/manhua/${id}`);
    } catch (error) {
      console.error("Error al eliminar el capítulo:", error);
      setError("Hubo un problema al eliminar el capítulo.");
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" />
        <p className="text-muted">Cargando capítulo...</p>
      </Container>
    );
  }

  return (
    <Container className="delete-container mt-4">
      <h2 className="text-danger">Eliminar Capítulo</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <p className="text-muted">
        ¿Estás seguro de que quieres eliminar el capítulo <strong>"{chapterTitle}"</strong>? Esta acción no se puede deshacer.
      </p>

      <Button className="custom-btn-danger" onClick={() => setShowModal(true)} disabled={deleting}>
        {deleting ? "Eliminando..." : "Sí, eliminar capítulo"}
      </Button>
      <Button className="custom-btn-secondary ms-2" onClick={() => navigate(`/manhua/${id}/chapter/${chapterId}`)}>
        Cancelar
      </Button>

      {/* Modal de Confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Realmente quieres eliminar el capítulo <strong>"{chapterTitle}"</strong>?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="custom-btn-secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button className="custom-btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeleteChapter;