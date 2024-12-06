const express = require('express');
const Novel = require('../models/Novel');
const { createNovel, getNovels, getLatestNovels,
  getNovelById, addChapter, addReview, searchNovels,
  getChapterById, deleteNovel } = require('../controllers/novelController');
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
  const genres = [
    'Fantasía',
    'Romance',
    'Ciencia ficción',
    'Drama',
    'Aventura',
    'Terror',
    'Suspenso',
    'Comedia',
    'Histórico',
    'Misterio',
    'Poesía',
    'Distopía',
  ];
  res.status(200).json(genres);
};

router.get('/genres', getGenres); // Rutas específicas primero
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
router.get('/latest', getLatestNovels);
router.get('/', getNovels);
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
router.post('/api/novels/:id/reviews/:reviewId/reply', isAuthenticated, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'El texto de la respuesta es obligatorio.' });
    }

    const novel = await Novel.findById(id);
    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada.' });
    }

    // Busca la reseña dentro del arreglo reviews
    const review = novel.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada.' });
    }

    // Agrega la respuesta al arreglo replies de la reseña
    review.replies = review.replies || [];
    review.replies.push({ text, createdAt: new Date() });

    await novel.save();

    res.status(201).json({ message: 'Respuesta agregada exitosamente.', review });
  } catch (error) {
    console.error('Error al agregar respuesta:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});
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
router.post('/:id/validate-password', isAuthenticated, async (req, res) => {
  // Lógica: comparar la contraseña enviada en req.body con la de la novela si es coreano.
  // Devolver success o error
});

// Ruta para actualizar una novela
router.put('/update/:id', upload, handleMulterError, async (req, res) => {
  try {
    const { id } = req.params;
    // Obtener campos del body
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
      languageOrigin,
      password,
      rawOrigin,
    } = req.body;

    // Validar ID
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'ID no válido' });
    }

    // Buscar la novela por ID
    const novel = await Novel.findById(id);
    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada.' });
    }

    // Validaciones de campos obligatorios
    // Solo se validan si se envían, si no se envían se mantienen los valores anteriores
    const finalTitle = title !== undefined ? title.trim() : novel.title;
    const finalDescription = description !== undefined ? description.trim() : novel.description;
    const finalClassification = classification !== undefined ? classification.trim() : novel.classification;
    const finalLanguageOrigin = languageOrigin !== undefined ? languageOrigin.trim() : novel.languageOrigin;
    const finalGenres = genres !== undefined ? genres.trim() : (novel.genres && novel.genres[0]) || '';

    // Si alguno de estos campos queda vacío tras el merge con el valor anterior,
    // significa que no se tenía valor y no se envió nuevo (y eran obligatorios).
    if (!finalTitle || !finalDescription || !finalClassification || !finalLanguageOrigin || !finalGenres) {
      return res.status(400).json({ message: 'Por favor, completa todos los campos obligatorios (Título, Sinopsis, Clasificación, Idioma, Género).' });
    }

    // Procesar subgéneros
    let finalSubGenres = novel.subGenres;
    if (subGenres !== undefined) {
      try {
        const parsedSub = JSON.parse(subGenres);
        if (!Array.isArray(parsedSub)) {
          return res.status(400).json({ message: 'subGenres debe ser un arreglo.' });
        }
        if (parsedSub.length > 15) {
          return res.status(400).json({ message: 'Solo puedes seleccionar hasta 15 subgéneros.' });
        }
        finalSubGenres = parsedSub;
      } catch (err) {
        return res.status(400).json({ message: 'Error al parsear subGenres.' });
      }
    }

    // Procesar tags
    let finalTags = novel.tags;
    if (tags !== undefined) {
      try {
        finalTags = JSON.parse(tags);
        if (!Array.isArray(finalTags)) {
          return res.status(400).json({ message: 'tags debe ser un arreglo.' });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Error al parsear tags.' });
      }
    }

    // Procesar colaboradores
    let finalCollaborators = novel.collaborators;
    if (collaborators !== undefined) {
      try {
        finalCollaborators = JSON.parse(collaborators);
        if (!Array.isArray(finalCollaborators)) {
          return res.status(400).json({ message: 'collaborators debe ser un arreglo.' });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Error al parsear collaborators.' });
      }
    }

    // Procesar adaptaciones
    let finalAdaptations = novel.adaptations;
    if (adaptations !== undefined) {
      try {
        finalAdaptations = JSON.parse(adaptations);
        if (!Array.isArray(finalAdaptations)) {
          return res.status(400).json({ message: 'adaptations debe ser un arreglo.' });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Error al parsear adaptations.' });
      }
    }

    // Procesar premios
    let finalAwards = novel.awards;
    if (awards !== undefined) {
      try {
        finalAwards = JSON.parse(awards);
        if (!Array.isArray(finalAwards)) {
          return res.status(400).json({ message: 'awards debe ser un arreglo.' });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Error al parsear awards.' });
      }
    }

    // Procesar rawOrigin
    let finalRawOrigin = novel.rawOrigin;
    if (rawOrigin !== undefined) {
      try {
        const parsedRawOrigin = JSON.parse(rawOrigin);
        if (!parsedRawOrigin || !parsedRawOrigin.origin || !parsedRawOrigin.link) {
          return res.status(400).json({ message: 'rawOrigin debe contener origin y link.' });
        }
        finalRawOrigin = parsedRawOrigin;
      } catch (err) {
        return res.status(400).json({ message: 'Error al parsear rawOrigin.' });
      }
    } else {
      // Si no se envía rawOrigin y no existe en la novela, es obligatorio.
      if (!novel.rawOrigin || !novel.rawOrigin.origin || !novel.rawOrigin.link) {
        return res.status(400).json({ message: 'rawOrigin (origin y link) es obligatorio.' });
      }
      finalRawOrigin = novel.rawOrigin;
    }

    // Validar idioma y password
    let finalPassword = novel.password;
    if (finalLanguageOrigin === 'Coreano') {
      // Si es coreano, password es obligatorio
      if (password === undefined && !finalPassword) {
        return res.status(400).json({ message: 'Es obligatorio proporcionar una contraseña para novelas en coreano.' });
      } else if (password !== undefined) {
        finalPassword = password;
      }
    } else {
      // Si no es coreano, puede no haber password (opcional)
      // Podemos dejar el password tal cual, o vaciarlo si se desea.
      // finalPassword = ''; // descomentar si se quiere limpiar la password en caso de cambiar el idioma
    }

    // Actualiza los campos
    novel.title = finalTitle;
    novel.description = finalDescription;
    novel.genres = finalGenres ? [finalGenres] : novel.genres;
    novel.subGenres = finalSubGenres;
    novel.classification = finalClassification;
    novel.tags = finalTags;
    novel.collaborators = finalCollaborators;
    novel.adaptations = finalAdaptations;
    novel.awards = finalAwards;
    novel.progress = progress || novel.progress;
    novel.languageOrigin = finalLanguageOrigin;
    novel.password = finalPassword;
    novel.rawOrigin = finalRawOrigin;

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
router.delete('/:id', isAuthenticated, deleteNovel);

module.exports = router;
