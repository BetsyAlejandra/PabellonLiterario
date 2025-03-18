import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert, Button } from "react-bootstrap";
import '../styles/ChapterReader.css'

const ChapterReader = () => {
    const { manhuaId, chapterNumber } = useParams();
    const [chapter, setChapter] = useState(null);
    const [chapterImages, setChapterImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                const { data } = await axios.get(`/api/manhuas/${manhuaId}/chapters/${chapterNumber}`);
                setChapter(data);
            } catch (err) {
                console.error("Error al cargar el capítulo:", err);
                setError("No se pudo cargar el capítulo.");
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, [manhuaId, chapterNumber]);

    // Bloquear F12, Ctrl+Shift+I, Ctrl+U
    useEffect(() => {
        const blockDevTools = (e) => {
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && e.key === "I") ||
                (e.ctrlKey && e.key === "U")
            ) {
                e.preventDefault();
                alert("Acción bloqueada 🚫");
            }
        };

        document.addEventListener("keydown", blockDevTools);

        return () => {
            document.removeEventListener("keydown", blockDevTools);
        };
    }, []);

    // Bloquear clic derecho
    useEffect(() => {
        const blockRightClick = (e) => e.preventDefault();
        document.addEventListener("contextmenu", blockRightClick);

        return () => {
            document.removeEventListener("contextmenu", blockRightClick);
        };
    }, []);

    // Agregar marca de agua a las imágenes
    useEffect(() => {
        const addWatermark = (imageSrc, text) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = imageSrc;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    ctx.font = "bold 20px Arial";
                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.textAlign = "right";
                    ctx.textBaseline = "bottom";
                    ctx.fillText(`${text} | ${new Date().toLocaleDateString()}`, canvas.width - 20, canvas.height - 20);

                    resolve(canvas.toDataURL());
                };
            });
        };

        if (chapter?.images) {
            const processImages = async () => {
                const watermarkedImages = await Promise.all(
                    chapter.images.map((image) => addWatermark(image, "Pabellón Literario"))
                );
                setChapterImages(watermarkedImages);
            };

            processImages();
        }
    }, [chapter]);

    useEffect(() => {
        const blockDevTools = (e) => {
            if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I") || (e.ctrlKey && e.key === "U")) {
                e.preventDefault();
                alert("Acción bloqueada 🚫");
            }
        };

        document.addEventListener("keydown", blockDevTools);
        return () => document.removeEventListener("keydown", blockDevTools);
    }, []);

    useEffect(() => {
        const detectExtensions = () => {
            const suspiciousElements = ["lightshot-screen", "screenshot-capture", "gofullpage"];

            suspiciousElements.forEach((el) => {
                if (document.querySelector(`[id*='${el}']`)) {
                    alert("⚠️ Se detectó un intento de captura de pantalla.");
                    window.location.href = "/";
                }
            });
        };

        setInterval(detectExtensions, 3000);
    }, []);

    // Detectar reducción de ventana (posible captura)
    useEffect(() => {
        let lastWidth = window.innerWidth;
        let lastHeight = window.innerHeight;

        const detectResize = () => {
            if (window.innerWidth < lastWidth - 100 || window.innerHeight < lastHeight - 100) {
                alert("⚠️ Se detectó un intento de captura de pantalla.");
                window.location.href = "/";
            }
            lastWidth = window.innerWidth;
            lastHeight = window.innerHeight;
        };

        window.addEventListener("resize", detectResize);
        return () => window.removeEventListener("resize", detectResize);
    }, []);

    // Bloquear PrintScreen y Ctrl+Shift+S
    useEffect(() => {
        const blockPrintScreen = (e) => {
            if (e.key === "PrintScreen" || (e.ctrlKey && e.shiftKey && e.key === "S")) {
                alert("🚫 Captura de pantalla bloqueada.");
                e.preventDefault();
            }
        };

        document.addEventListener("keydown", blockPrintScreen);
        return () => document.removeEventListener("keydown", blockPrintScreen);
    }, []);

    useEffect(() => {
        const handleBlur = () => {
            document.querySelectorAll(".chapter-image").forEach((img) => {
                img.style.filter = "blur(8px)"; // Aplica desenfoque
            });
        };

        const handleFocus = () => {
            document.querySelectorAll(".chapter-image").forEach((img) => {
                img.style.filter = "none"; // Quita el desenfoque
            });
        };

        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    useEffect(() => {
        const preventInspect = (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) {
                e.preventDefault();
                alert("⚠️ No puedes inspeccionar este contenido.");
            }
        };

        document.addEventListener("keydown", preventInspect);
        return () => document.removeEventListener("keydown", preventInspect);
    }, []);

    useEffect(() => {
        const blockDrag = (e) => e.preventDefault();

        document.addEventListener("dragstart", blockDrag);
        return () => document.removeEventListener("dragstart", blockDrag);
    }, []);


    const today = new Date().toLocaleDateString();


    return (
        <Container className="chapter-container">
            {loading ? (
                <Spinner animation="border" className="text-center" />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    <h2 className="chapter-title">{chapter.manhuaTitle} - {chapter.title}</h2>

                    <div className="d-flex flex-column align-items-center">
                        {chapterImages.map((image, index) => (
                            <img key={index} src={image} alt={`Página ${index + 1}`} className="chapter-image" />
                        ))}
                    </div>

                    <div className="back-button">
                        <Link to={`/manhua/${manhuaId}`}>← Volver al Manhua</Link>
                    </div>
                </>
            )}
        </Container>
    );

};

export default ChapterReader;