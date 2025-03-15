import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Image, Alert } from "react-bootstrap";

const EditChapterM = () => {
  const { id, chapterId } = useParams(); // ID del manhua y del capítulo
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [existingImages, setExistingImages] = useState([]); // Imágenes ya subidas
  const [newImages, setNewImages] = useState([]); // Imágenes nuevas
  const [previewNewImages, setPreviewNewImages] = useState([]); // Vista previa de nuevas imágenes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Cargar datos del capítulo
    const fetchChapter = async () => {
      try {
        const { data } = await axios.get(`/api/manhuas/${id}/chapters/${chapterId}`);
        setTitle(data.title);
        setExistingImages(data.images);
      } catch (error) {
        console.error("Error al obtener el capítulo:", error);
        setError("No se pudo cargar el capítulo.");
      }
    };

    fetchChapter();
  }, [id, chapterId]);

  // Manejar la selección de nuevas imágenes
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    // Crear vistas previas de las nuevas imágenes
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewNewImages(previews);
  };

  // Eliminar una imagen existente
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Enviar cambios al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    existingImages.forEach((image) => formData.append("existingImages", image));
    newImages.forEach((image) => formData.append("newImages", image));

    try {
      await axios.put(`/api/manhuas/${id}/chapters/${chapterId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/manhua/${id}/chapter/${chapterId}`); // Redirigir a los detalles del capítulo
    } catch (error) {
      console.error("Error al actualizar el capítulo:", error);
      setError("Hubo un problema al actualizar el capítulo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Editar Capítulo</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Título del capítulo */}
        <Form.Group className="mb-3">
          <Form.Label>Título del capítulo</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        {/* Imágenes existentes */}
        <Form.Group className="mb-3">
          <Form.Label>Imágenes existentes</Form.Label>
          <div className="d-flex flex-wrap">
            {existingImages.map((img, index) => (
              <div key={index} className="position-relative m-2">
                <Image src={img} className="img-thumbnail" style={{ width: "100px", height: "auto" }} />
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0"
                  onClick={() => removeExistingImage(index)}
                >
                  ✖
                </Button>
              </div>
            ))}
          </div>
        </Form.Group>

        {/* Subir nuevas imágenes */}
        <Form.Group className="mb-3">
          <Form.Label>Agregar nuevas imágenes</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept=".jpg,.png,.webp"
            onChange={handleNewImageChange}
          />
        </Form.Group>

        {/* Vista previa de nuevas imágenes */}
        <div className="d-flex flex-wrap">
          {previewNewImages.map((src, index) => (
            <Image key={index} src={src} className="img-thumbnail m-2" style={{ width: "100px", height: "auto" }} />
          ))}
        </div>

        {/* Botones */}
        <div className="mt-3">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => navigate(`/manhua/${id}/chapter/${chapterId}`)}>
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditChapterM;