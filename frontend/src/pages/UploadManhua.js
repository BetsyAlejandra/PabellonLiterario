import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UploadManhua.css"; // Importar los estilos

const UploadManhua = () => {
  const navigate = useNavigate();
  const [manhuaData, setManhuaData] = useState({
    title: "",
    description: "",
    genre: "",
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
    const formData = new FormData();
    
    formData.append("title", manhuaData.title);
    formData.append("description", manhuaData.description);
    formData.append("genre", manhuaData.genre);
    if (manhuaData.cover) formData.append("cover", manhuaData.cover);

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
      console.error(error);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Subir Nuevo Manhua</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        
        {/* Título */}
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

        {/* Descripción */}
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

        {/* Género */}
        <div className="mb-3">
          <label className="form-label">Género</label>
          <input
            type="text"
            name="genre"
            className="form-control"
            value={manhuaData.genre}
            onChange={handleChange}
            required
          />
        </div>

        {/* Portada */}
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

        {/* Botón de enviar */}
        <button type="submit" className="upload-button">
          Subir Manhua
        </button>
      </form>
    </div>
  );
};

export default UploadManhua;