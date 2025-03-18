import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Spinner, Image, ProgressBar } from "react-bootstrap";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import "../styles/ChapterDetails.css";

const ChapterDetails = () => {
  const { id, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`/api/manhuas/${id}/chapters/${chapterNumber}`);
        setChapter(response.data);

        if (response.data.next) {
          axios.get(`/api/manhuas/${id}/chapters/${response.data.next}`);
        }
      } catch (error) {
        console.error("Error al obtener el capítulo", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [id, chapterNumber]);


  const navigateToNext = () => {
    if (chapter.next) {
      navigate(`/manhua/${id}/chapter/${chapter.next}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrollTop / scrollHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear atajos de teclado para evitar inspección
  useEffect(() => {
    const disableShortcuts = (event) => {
      if (
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && event.key === "I") ||
        (event.ctrlKey && event.key === "u")
      ) {
        event.preventDefault();
      }
    };

    const disableContextMenu = (event) => event.preventDefault();

    document.addEventListener("keydown", disableShortcuts);
    document.addEventListener("contextmenu", disableContextMenu);

    return () => {
      document.removeEventListener("keydown", disableShortcuts);
      document.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  // Navegación con teclado (← y → para cambiar de capítulo)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" && chapter?.previous) {
        navigate(`/manhua/${id}/chapter/${chapter.previous}`);
      } else if (event.key === "ArrowRight" && chapter?.next) {
        navigate(`/manhua/${id}/chapter/${chapter.next}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [id, chapter, navigate]);


  useEffect(() => {
    const disableRightClick = (event) => event.preventDefault();
    const disableCopy = (event) => event.preventDefault();

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("copy", disableCopy);
    document.addEventListener("cut", disableCopy);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("cut", disableCopy);
    };
  }, []);

  useEffect(() => {
    const blockDevTools = (event) => {
      if (
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && event.key === "I") ||
        (event.ctrlKey && event.shiftKey && event.key === "J") ||
        (event.ctrlKey && event.key === "u")
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", blockDevTools);

    return () => {
      document.removeEventListener("keydown", blockDevTools);
    };
  }, []);


  useEffect(() => {
    const blockPrintScreen = (event) => {
      if (event.key === "PrintScreen") {
        event.preventDefault();
        alert("Capturas de pantalla deshabilitadas.");
      }
    };

    document.addEventListener("keydown", blockPrintScreen);
    return () => {
      document.removeEventListener("keydown", blockPrintScreen);
    };
  }, []);



  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Error al entrar en pantalla completa:", err);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };


  const adjustZoom = (factor) => {
    setZoom((prevZoom) => Math.max(0.5, Math.min(prevZoom + factor, 2)));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        if (chapter.next) navigate(`/manhua/${id}/chapter/${chapter.next}`);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapter, navigate]);

  useEffect(() => {
    if (!isPinned) {
      const timeout = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, isPinned]);

  const showUI = () => {
    setIsVisible(true);
  };


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
    <Container
      className="chapter-container"
      onMouseMove={showUI}
      onTouchStart={showUI}
    >
      {/* Barra de progreso arriba para mejor UX */}
      <ProgressBar
        now={progress}
        label={`${Math.round(progress)}%`}
        className="reading-progress fixed-progress"
      />

      {/* Encabezado con botón de regreso y título alineados */}
      <div className="chapter-header">
        <Button className="back-button" onClick={() => navigate(`/manhua/${id}`)}>
          ← Volver a detalles
        </Button>
        <h2 className="chapter-title">
          {chapter.title || `Capítulo ${chapter.number}`}
        </h2>
      </div>

      {/* Barra de herramientas con opción de vista */}
      <div className="toolbar">
        <Button onClick={() => setIsHorizontal(!isHorizontal)}>
          {isHorizontal ? "📜 Vista Vertical" : "📏 Vista Horizontal"}
        </Button>
      </div>

      {/* Contenedor de imágenes */}
      <PhotoProvider>
        <div className={`chapter-images ${isHorizontal ? "horizontal" : "vertical"}`}>
          {chapter.images && chapter.images.length > 0 ? (
            chapter.images.map((image, index) => (
              <PhotoView key={index} src={image}>
                <Image
                  src={image}
                  loading="lazy"
                  className="img-fluid no-drag"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
              </PhotoView>
            ))
          ) : (
            <p>No hay imágenes disponibles para este capítulo.</p>
          )}
        </div>
      </PhotoProvider>

      {/* Navegación entre capítulos */}
      <div className="chapter-navigation">
        <Button
          variant="link"
          aria-label="Capítulo anterior"
          onClick={() => {
            if (chapter.previous) {
              navigate(`/manhua/${id}/chapter/${chapter.previous}`);
            }
          }}
          disabled={!chapter.previous}
          className="nav-btn"
        >
          ← Anterior
        </Button>

        <Button
          variant="link"
          aria-label="Contenido"
          onClick={() => navigate(`/manhua/${id}`)}
          className="nav-btn"
        >
          📖 Contenido
        </Button>

        <Button
          variant="link"
          aria-label="Capítulo siguiente"
          onClick={navigateToNext}
          disabled={!chapter.next}
          className="nav-btn"
        >
          Siguiente →
        </Button>
      </div>
    </Container>
  );

};

export default ChapterDetails;