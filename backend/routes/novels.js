const express = require('express');
const Novel = require('../models/Novel');
const { createNovel, getNovels, getLatestNovels, 
  getNovelById, addChapter, addReview, searchNovels,
getChapterById  } = require('../controllers/novelController');
const { upload, handleMulterError } = require('../middlewares/upload');

const router = express.Router();

// Middleware de autenticación
const isAuthenticated = (req, res, next) => {
  console.log('Sesión:', req.session); // Agrega un log para ver la sesión
  if (req.session && req.session.user && req.session.user.username) {
    return next();
  }
  return res.status(401).json({ message: 'No autorizado. Inicia sesión.' });
};

const getGenres = (req, res) => {
  console.log('Ruta /genres alcanzada');
  const validGenres = ["Fantasía","Romance","Ciencia ficción","Drama","Aventura","Terror",
    "Suspenso","Comedia","Histórico","Misterio","Poesía","Distopía"];
  res.status(200).json(validGenres);
};

router.get('/search', searchNovels);
router.get('/my-stories', isAuthenticated, async (req, res) => {
  try {
    const user = req.session.user; // O req.user si usas JWT
    if (!user || !user.username) {
      console.warn('Usuario no autenticado o sin nombre de usuario.');
      return res.status(401).json({ message: 'No autorizado. Inicia sesión.' });
    }

    // Filtrar novelas por el nombre de usuario del autor
    const stories = await Novel.find({ author: user.username });
    res.status(200).json(stories);
  } catch (err) {
    console.error('Error al obtener las historias del usuario:', err.message);
    res.status(500).json({ message: 'Error al cargar las historias.' });
  }
});

// Rutas específicas primero
router.get('/genres', getGenres); // Rutas específicas primero
router.get('/latest', getLatestNovels);

router.get('/', getNovels);
// Ruta para subir una novela con imagen
router.post('/create', isAuthenticated, upload, handleMulterError, createNovel);
router.get('/:storyId/chapters/:chapterId', async (req, res) => {
  const { storyId, chapterId } = req.params;
  try {
      const novel = await Novel.findById(storyId);
      if (!novel) {
          return res.status(404).json({ message: 'Novela no encontrada' });
      }

      const chapter = novel.chapters.id(chapterId);
      if (!chapter) {
          return res.status(404).json({ message: 'Capítulo no encontrado' });
      }

      res.status(200).json(chapter);
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener el capítulo', error: error.message });
  }
});
router.put('/:storyId/chapters/:chapterId', async (req, res) => {
  const { storyId, chapterId } = req.params;
  const { title, content } = req.body;

  try {
      const novel = await Novel.findById(storyId);
      if (!novel) {
          return res.status(404).json({ message: 'Novela no encontrada' });
      }

      const chapter = novel.chapters.id(chapterId);
      if (!chapter) {
          return res.status(404).json({ message: 'Capítulo no encontrado' });
      }

      chapter.title = title || chapter.title;
      chapter.content = content || chapter.content;

      await novel.save();
      res.status(200).json({ message: 'Capítulo actualizado exitosamente' });
  } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el capítulo', error: error.message });
  }
});
router.post('/:id/reviews', isAuthenticated, addReview);
router.get('/:storyId/chapters/:chapterId', getChapterById);
router.get('/:storyId/chapters/:chapterId/navigation', async (req, res) => {
  const { storyId, chapterId } = req.params;
  try {
    const novel = await Novel.findById(storyId);
    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada.' });
    }

    const chapterIndex = novel.chapters.findIndex(ch => ch._id.toString() === chapterId);
    if (chapterIndex === -1) {
      return res.status(404).json({ message: 'Capítulo no encontrado.' });
    }

    const previous = chapterIndex > 0 ? novel.chapters[chapterIndex - 1]._id : null;
    const next = chapterIndex < novel.chapters.length - 1 ? novel.chapters[chapterIndex + 1]._id : null;

    res.status(200).json({
      previous,
      next,
      content: storyId,
    });
  } catch (error) {
    console.error('Error al obtener navegación:', error.message);
    res.status(500).json({ message: 'Error al obtener navegación.', error });
  }
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  // Si el ID es "genres", delega el control al siguiente middleware (que será la ruta específica)
  if (id === 'genres') {
    return next();
  }

  // Validar si el ID es un ObjectId válido
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  // Llama al controlador para manejar la solicitud
  getNovelById(req, res);
});
// Ruta para actualizar una novela
router.put('/update/:id', upload, handleMulterError, async (req, res) => {
  try {

    const { id } = req.params;
    const {
      title,
      description,
      genres,
      subGenres,
      classification,
      tags,
      collaborators,
      adaptations,
      awards,
      progress,
    } = req.body;

    // Busca la novela por ID
    const novel = await Novel.findById(id);

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'ID no válido' });
    }

    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada.' });
    }



    // Actualiza los campos
    novel.title = title || novel.title;
    novel.description = description || novel.description;
    novel.genres = genres ? [genres] : novel.genres;
    novel.subGenres = subGenres ? JSON.parse(subGenres) : novel.subGenres;
    novel.classification = classification || novel.classification;
    novel.tags = tags ? JSON.parse(tags) : novel.tags;
    novel.collaborators = collaborators ? JSON.parse(collaborators) : novel.collaborators;
    novel.adaptations = adaptations ? JSON.parse(adaptations) : novel.adaptations;
    novel.awards = awards ? JSON.parse(awards) : novel.awards;
    novel.progress = progress || novel.progress;

    // Actualiza la portada solo si hay una nueva
    if (req.file) {
      novel.coverImage = `/uploads/${req.file.filename}`;
    }


    // Guarda los cambios en la base de datos
    await novel.save();

    res.status(200).json({ message: 'Novela actualizada exitosamente.', novel });
  } catch (err) {
    console.error('Error al actualizar la novela:', err);
    res.status(500).json({ message: 'Error al actualizar la novela.', error: err.message });
  }
});

router.post('/add-chapter/:id', addChapter);

module.exports = router;
