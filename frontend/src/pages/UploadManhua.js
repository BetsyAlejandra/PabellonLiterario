import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UploadManhua.css"; // Importar los estilos

const UploadManhua = () => {
  const navigate = useNavigate();
  const [manhuaData, setManhuaData] = useState({
    title: "",
    alternativeTitle: "",
    description: "",
    genre: "",
    status: "En emisión", // Valor por defecto
    demographic: "Danmei", // Valor por defecto
    cover: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setManhuaData({ ...manhuaData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setManhuaData({ ...manhuaData, cover: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!manhuaData.title.trim() || !manhuaData.description.trim() || !manhuaData.genre.trim() || !manhuaData.cover) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("title", manhuaData.title);
    formData.append("alternativeTitle", manhuaData.alternativeTitle);
    formData.append("description", manhuaData.description);
    formData.append("status", manhuaData.status);
    formData.append("demographic", manhuaData.demographic);

    const genresArray = manhuaData.genre.split(",").map((g) => g.trim());
    formData.append("genres", JSON.stringify(genresArray));

    if (manhuaData.cover) formData.append("coverImage", manhuaData.cover);

    try {
      const response = await axios.post("/api/manhuas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("¡Manhua subido con éxito!");
        navigate("/manhuas");
      }
    } catch (error) {
      alert("Error al subir el manhua.");
      console.error("Error en el frontend:", error);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Subir Nuevo Manhua</h2>
      <form onSubmit={handleSubmit} className="upload-form">

        <div className="mb-3">
          <label className="form-label">Título del Manhua</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={manhuaData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Título Alternativo</label>
          <input
            type="text"
            name="alternativeTitle"
            className="form-control"
            value={manhuaData.alternativeTitle}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            value={manhuaData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Géneros (separados por comas)</label>
          <input
            type="text"
            name="genre"
            className="form-control"
            value={manhuaData.genre}
            onChange={handleChange}
            placeholder="Ej: Fantasía, Aventura, Acción"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select name="status" className="form-control" value={manhuaData.status} onChange={handleChange} required>
            <option value="En emisión">En emisión</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Pausado">Pausado</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Demografía</label>
          <select name="demographic" className="form-control" value={manhuaData.demographic} onChange={handleChange} required>
            <option value="Shounen">Shounen</option>
            <option value="Shoujo">Shoujo</option>
            <option value="Seinen">Seinen</option>
            <option value="Josei">Josei</option>
            <option value="Danmei">Danmei</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Portada</label>
          <input
            type="file"
            className="form-control"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            required
          />
          {preview && (
            <div className="upload-preview">
              <img src={preview} alt="Vista previa" />
            </div>
          )}
        </div>

        <button type="submit" className="upload-button">
          Subir Manhua
        </button>
      </form>
    </div>
  );
};

export default UploadManhua;