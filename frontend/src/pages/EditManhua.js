import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import axios from "axios";
import "../styles/editManhua.css";

const EditManhua = () => {
  const { manhuaId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    alternativeTitle: "",
    description: "",
    coverImage: null,
    genres: "",
    status: "En emisión",
    demographic: "Danmei",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchManhua = async () => {
      try {
        const response = await axios.get(`/api/manhuas/${manhuaId}`);
        const data = response.data;

        setFormData({
          title: data.title || "",
          alternativeTitle: data.alternativeTitle || "",
          description: data.description || "",
          genres: data.genres ? data.genres.join(", ") : "",
          status: data.status || "En emisión",
          demographic: data.demographic || "Danmei",
        });

        if (data.coverImage) {
          setPreviewImage(data.coverImage);
        }
      } catch (error) {
        setError("Error al cargar el manhua");
      }
    };

    fetchManhua();
  }, [manhuaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("alternativeTitle", formData.alternativeTitle);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("genres", formData.genres);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("demographic", formData.demographic);

    if (formData.coverImage instanceof File) {
      formDataToSend.append("coverImage", formData.coverImage);
    }

    try {
      const response = await axios.put(`/api/manhuas/${manhuaId}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Manhua actualizado con éxito");
        navigate("/manhuas");
      }
    } catch (error) {
      setError("Error al actualizar el manhua");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="edit-manhua-container">
      <h3 className="edit-manhua-title">Editar Manhua</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="edit-manhua-form">
        <Form.Group className="mb-3">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Título Alternativo</Form.Label>
          <Form.Control
            type="text"
            name="alternativeTitle"
            value={formData.alternativeTitle}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Portada</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && (
            <img src={previewImage} alt="Vista previa" className="cover-preview" />
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Géneros (separados por comas)</Form.Label>
          <Form.Control
            type="text"
            name="genres"
            value={formData.genres}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Estado</Form.Label>
          <Form.Select name="status" value={formData.status} onChange={handleChange}>
            <option value="En emisión">En emisión</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Pausado">Pausado</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Demografía</Form.Label>
          <Form.Select name="demographic" value={formData.demographic} onChange={handleChange}>
            <option value="Shounen">Shounen</option>
            <option value="Shoujo">Shoujo</option>
            <option value="Seinen">Seinen</option>
            <option value="Josei">Josei</option>
            <option value="Danmei">Danmei</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" className="btn-custom" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </Form>
    </Container>
  );
};

export default EditManhua;