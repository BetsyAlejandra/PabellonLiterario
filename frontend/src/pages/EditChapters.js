import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Table, Image } from "react-bootstrap";
import axios from "axios";
import "../styles/EditChapters.css";

const EditChapters = () => {
  const { manhuaId } = useParams();
  const navigate = useNavigate();

  const [manhuaTitle, setManhuaTitle] = useState("");
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Formulario para nuevo capítulo
  const [newChapter, setNewChapter] = useState({
    number: "",
    title: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(`/api/manhuas/${manhuaId}`);
        setChapters(response.data.chapters);
        setManhuaTitle(response.data.title);
      } catch (error) {
        setError("Error al cargar capítulos. Asegúrate de que el servidor está activo.");
      }
    };

    fetchChapters();
  }, [manhuaId]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewChapter({ ...newChapter, [name]: value });
  };

  // Manejar imágenes del capítulo
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewChapter({ ...newChapter, images: files });

    // Crear vistas previas
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Subir nuevo capítulo
  const handleAddChapter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verificar si el capítulo ya existe
    if (chapters.some((chap) => chap.number === newChapter.number)) {
      setError("El número de capítulo ya existe.");
      setLoading(false);
      return;
    }

    if (!newChapter.images.length) {
      setError("Debes subir al menos una imagen.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("number", newChapter.number);
    formData.append("title", newChapter.title);
    newChapter.images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post(`/api/manhuas/${manhuaId}/chapters`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Capítulo agregado con éxito");
        setNewChapter({ number: "", title: "", images: [] });
        setPreviewImages([]);
        setChapters([...chapters, response.data]);
      }
    } catch (error) {
      setError("Error al agregar el capítulo. Verifica el formato de las imágenes.");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar capítulo
  const handleDeleteChapter = async (chapterNumber) => {
    if (!window.confirm("¿Seguro que quieres eliminar este capítulo?")) return;

    try {
      await axios.delete(`/api/manhuas/${manhuaId}/chapters/${chapterNumber}`);
      setChapters(chapters.filter((chapter) => chapter.number !== chapterNumber));
    } catch (error) {
      setError("Error al eliminar capítulo.");
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Gestión de Capítulos - {manhuaTitle}</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Formulario para agregar capítulo */}
      <Form onSubmit={handleAddChapter} className="p-3 border rounded shadow mb-4 bg-dark text-light">
        <h5>Agregar Nuevo Capítulo</h5>

        <Form.Group className="mb-3">
          <Form.Label>Número del Capítulo</Form.Label>
          <Form.Control
            type="number"
            name="number"
            value={newChapter.number}
            onChange={handleChange}
            required
            min="1"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Título del Capítulo</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={newChapter.title}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Imágenes del Capítulo</Form.Label>
          <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} required />
        </Form.Group>

        {/* Vista previa de imágenes */}
        <div className="preview-container">
          {previewImages.map((src, index) => (
            <Image key={index} src={src} className="preview-image" />
          ))}
        </div>

        <Button type="submit" variant="success" disabled={loading || !newChapter.images.length}>
          {loading ? "Agregando..." : "Agregar Capítulo"}
        </Button>
      </Form>

      {/* Lista de capítulos */}
      <h5>Capítulos Existentes</h5>
      <Table striped bordered hover responsive className="table-dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <tr key={chapter.number}>
                <td>{chapter.number}</td>
                <td>{chapter.title || "Sin título"}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/manhuas/${manhuaId}/chapters/${chapter.number}/edit`)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteChapter(chapter.number)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No hay capítulos</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default EditChapters;