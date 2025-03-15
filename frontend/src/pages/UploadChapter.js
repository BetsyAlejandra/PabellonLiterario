import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Image, Alert } from "react-bootstrap";
import "../styles/UploadChapter.css";

const UploadChapter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!number || images.length === 0) {
      setError("Debes agregar un número de capítulo y al menos una imagen.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("number", number);
    formData.append("title", title);
    images.forEach((image) => formData.append("images", image));

    try {
      await axios.post(`/api/manhuas/${id}/chapters`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/manhua/${id}`);
    } catch (error) {
      console.error("Error al subir el capítulo:", error);
      setError("Hubo un problema al subir el capítulo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="upload-container">
      <h2 className="upload-title">Subir Nuevo Capítulo</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="upload-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Número de capítulo</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Título del capítulo</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Opcional"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Imágenes del capítulo</Form.Label>
          <Form.Control type="file" multiple accept=".jpg,.png,.webp" onChange={handleImageChange} required />
        </Form.Group>

        <div className="upload-preview">
          {previewImages.map((src, index) => (
            <div key={index} className="position-relative">
              <img src={src} alt={`preview-${index}`} className="preview-img" />
              <button className="remove-img-btn" onClick={() => setPreviewImages(previewImages.filter((_, i) => i !== index))}>×</button>
            </div>
          ))}
        </div>

        <div className="upload-buttons mt-3">
          <Button className="upload-btn" type="submit" disabled={loading}>
            {loading ? "Subiendo..." : "Subir Capítulo"}
          </Button>
          <Button className="cancel-btn" onClick={() => navigate(`/manhua/${id}`)}>Cancelar</Button>
        </div>
      </Form>
    </Container>
  );
};

export default UploadChapter;