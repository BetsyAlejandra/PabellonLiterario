import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/global.css';

const Novela = () => {
  const { id } = useParams(); // Obtiene el ID de la novela desde la URL
  const [novela, setNovela] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newChapter, setNewChapter] = useState('');
  const history = useNavigate();

  useEffect(() => {
    const fetchNovela = async () => {
      try {
        const res = await axios.get(`https://pabellonliterario.com/api/novels/${id}`);
        setNovela(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la novela.');
        setLoading(false);
      }
    };
    fetchNovela();
  }, [id]);

  const handleAddChapter = async () => {
    try {
      const res = await axios.post(`https://pabellonliterario.com/api/novels/${id}/chapters`, {
        title: newChapter,
      });
      setNovela(prev => ({ ...prev, chapters: [...prev.chapters, res.data] }));
      setNewChapter('');
    } catch (err) {
      setError('Error al agregar el capítulo.');
    }
  };

  const handleEditChapter = (chapterId, newTitle) => {
    axios.put(`https://pabellonliterario.com/api/novels/${id}/chapters/${chapterId}`, { title: newTitle })
      .then(res => {
        const updatedChapters = novela.chapters.map(chapter => 
          chapter.id === chapterId ? res.data : chapter
        );
        setNovela(prev => ({ ...prev, chapters: updatedChapters }));
      })
      .catch(err => setError('Error al editar el capítulo.'));
  };

  const handleDeleteChapter = (chapterId) => {
    axios.delete(`https://pabellonliterario.com/api/novels/${id}/chapters/${chapterId}`)
      .then(() => {
        const updatedChapters = novela.chapters.filter(chapter => chapter.id !== chapterId);
        setNovela(prev => ({ ...prev, chapters: updatedChapters }));
      })
      .catch(err => setError('Error al eliminar el capítulo.'));
  };

  if (loading) return <p className="text-center">Cargando novela...</p>;
  if (error) return <p className="text-center">{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center">Editar Novela</h2>
      <div className="novela-details">
        {/* Sección de portada */}
        <div className="novela-cover">
          <img src={novela.coverImage} alt={novela.title} style={{ maxWidth: '200px' }} />
        </div>
        
        {/* Sección de detalles */}
        <div className="novela-info mt-4">
          <h3>{novela.title}</h3>
          <p><strong>Descripción:</strong> {novela.description}</p>
          <p><strong>Género:</strong> {novela.genre}</p>
          <p><strong>Etiquetas:</strong> {novela.tags.join(', ')}</p>
        </div>
        
        {/* Sección de capítulos */}
        <div className="chapters-section mt-4">
          <h4>Capítulos</h4>
          <ul>
            {novela.chapters.map(chapter => (
              <li key={chapter.id} className="chapter-item">
                <span>{chapter.title}</span>
                <button onClick={() => handleEditChapter(chapter.id, prompt('Nuevo título', chapter.title))}>
                  Editar
                </button>
                <button onClick={() => handleDeleteChapter(chapter.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newChapter}
            onChange={(e) => setNewChapter(e.target.value)}
            placeholder="Nuevo capítulo"
          />
          <button onClick={handleAddChapter}>Agregar Capítulo</button>
        </div>
      </div>
    </div>
  );
};

export default Novela;
