import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Spinner, Image } from "react-bootstrap";
import "../styles/ChapterDetails.css"; // Importamos los estilos

const ChapterDetails = () => {
  const { id, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`/api/manhuas/${id}/chapters/${chapterNumber}`);
        setChapter(response.data);
      } catch (error) {
        console.error("Error al obtener el capítulo", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [id, chapterNumber]);

  if (loading) {
    return (
      <Container className="spinner-container">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!chapter) {
    return <p>No se encontraron imágenes para este capítulo.</p>;
  }

  return (
    <Container className="chapter-container">
      {/* Botón para volver a los detalles del manhua */}
      <Button className="back-button" onClick={() => navigate(`/manhua/${id}`)}>
        ← Volver a detalles
      </Button>

      <h2 className="chapter-title">{chapter.title || `Capítulo ${chapter.number}`}</h2>

      {/* Mostrar imágenes del capítulo */}
      {chapter.images && chapter.images.length > 0 ? (
        <div className="chapter-images">
          {chapter.images.map((image, index) => (
            <Image key={index} src={image} className="img-fluid" />
          ))}
        </div>
      ) : (
        <p>No hay imágenes disponibles para este capítulo.</p>
      )}

      {/* Botones de navegación entre capítulos */}
      <div className="chapter-nav">
        <Button
          className="nav-button"
          disabled={chapter.number <= 1}
          onClick={() => navigate(`/manhua/${id}/chapter/${parseInt(chapterNumber) - 1}`)}
        >
          ← Capítulo Anterior
        </Button>

        <Button
          className="nav-button"
          onClick={() => navigate(`/manhua/${id}/chapter/${parseInt(chapterNumber) + 1}`)}
        >
          Capítulo Siguiente →
        </Button>
      </div>
    </Container>
  );
};

export default ChapterDetails;