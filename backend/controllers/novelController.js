const mongoose = require('mongoose');
const Novel = require('../models/Novel');
const User = require('../models/User');
const { sendDiscordNotification } = require('../services/discordService');
const bcrypt = require('bcryptjs');

const createNovel = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.username) {
      return res.status(401).json({ message: 'No autorizado. Debe iniciar sesión para crear una novela.' });
    }

    const {
      title,
      description,
      genres,
      classification,
      tags,
      collaborators,
      adaptations,
      rawOrigin,
      subGenres,
      languageOrigin,
      password, // Contraseña, solo requerida si el idioma de origen es "Coreano"
      progress,
    } = req.body;

    // Validaciones iniciales
    if (!title || !description || !classification || !genres) {
      return res.status(400).json({ message: 'Por favor completa todos los campos obligatorios.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'La portada es obligatoria.' });
    }

    if (languageOrigin === 'Coreano' && !password) {
      return res.status(400).json({ message: 'Es obligatorio proporcionar una contraseña para novelas en coreano.' });
    }

    // Validar tipo de archivo (solo imágenes permitidas)
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'El archivo de portada debe ser una imagen válida (JPEG, PNG, WEBP).' });
    }

    // Limitar subgéneros a 15
    const subGenresArray = Array.isArray(subGenres) ? subGenres.slice(0, 15) : [];

    // Procesar datos
    const genresArray = Array.isArray(genres) ? genres : genres ? [genres] : [];
    const parsedCollaborators = collaborators ? JSON.parse(collaborators) : [];
    const parsedAdaptations = adaptations ? JSON.parse(adaptations) : [];
    const parsedRawOrigin = rawOrigin ? JSON.parse(rawOrigin) : [];

    // Hash de la contraseña si aplica
    let hashedPassword = '';
    if (languageOrigin === 'Coreano' && password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // Crear la novela
    const newNovel = await Novel.create({
      title,
      description,
      genres: genresArray,
      classification,
      tags: tags ? JSON.parse(tags) : [],
      coverImage: `/uploads/${req.file.filename}`,
      author: req.session.user.username,
      collaborators: parsedCollaborators,
      adaptations: parsedAdaptations,
      rawOrigin: parsedRawOrigin,
      subGenres: subGenresArray,
      languageOrigin,
      password: hashedPassword, // Establecer contraseña hasheada solo si aplica
      progress,
    });

    res.status(201).json(newNovel);
  } catch (error) {
    console.error('Error al crear la novela:', error);
    res.status(500).json({ message: 'Error al crear la novela', error: error.message });
  }
};

// Obtener todas las novelas
const getNovels = async (req, res) => {
  try {
    const novels = await Novel.find().sort({ createdAt: -1 }); // Ordena por fecha de creación (más recientes primero)
    res.status(200).json(novels);
  } catch (error) {
    console.error('Error al obtener todas las novelas:', error.message);
    res.status(500).json({ message: 'Error al obtener las novelas', error });
  }
};

// Obtener las últimas 5 novelas
const getLatestNovels = async (req, res) => {
  try {
    const novels = await Novel.find().sort({ createdAt: -1 }).limit(5); // Obtén las 5 más recientes
    res.status(200).json(novels);
  } catch (error) {
    console.error('Error al obtener las últimas novelas:', error.message);
    res.status(500).json({ message: 'Error al obtener las últimas novelas', error });
  }
};

// Obtener una novela por ID
const getNovelById = async (req, res) => {
  const { id } = req.params;

  // Validar el ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.warn(`ID inválido recibido: ${id}`); // Advertencia para IDs inválidos
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const novel = await Novel.findById(id);
    if (!novel) {
      console.warn(`Novela no encontrada para el ID: ${id}`); // Log si no se encuentra
      return res.status(404).json({ message: 'Novela no encontrada' });
    }
    res.status(200).json(novel);
  } catch (error) {
    console.error(`Error al obtener la novela con ID ${id}:`, error.message);
    res.status(500).json({ message: 'Error al obtener la novela', error });
  }
};

const addChapter = async (req, res) => {
  try {
    const { id } = req.params;  // ID de la novela a la que se le agregará el capítulo
    const { title, content, publishedAt } = req.body;

    // Validar los datos
    if (!title || !content) {
      return res.status(400).json({ message: 'El título y contenido del capítulo son obligatorios' });
    }

    // Crear el nuevo capítulo
    const newChapter = {
      title,
      content,
      publishedAt,
    };


    // Buscar la novela por su ID y agregar el capítulo
    const novel = await Novel.findById(id);
    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada' });
    }

    // Agregar el capítulo al array de capítulos
    novel.chapters.push(newChapter);

    // Guardar los cambios en la novela
    const savedNovel = await novel.save();

    // Obtener el último capítulo agregado (el recién creado)
    const newChapterSaved = savedNovel.chapters[savedNovel.chapters.length - 1];

    // Preparar los detalles para Discord
    const updateDetails = {
      titulo: `${title}`,
      descripcion: `Se ha agregado un nuevo capítulo a la novela **${novel.title}**. <@&1310810841414762516>`, // Mención de un rol de Discord
      link: `https://pabellonliterario.com/read-chapter/${id}/${newChapterSaved._id}`, // Enlace al capítulo
    };

    // Enviar la notificación a Discord
    await sendDiscordNotification(updateDetails);

    res.status(201).json({ message: 'Capítulo agregado con éxito', chapter: newChapter });
  } catch (error) {
    console.error('Error al agregar el capítulo:', error.message);
    res.status(500).json({ message: 'Error al agregar el capítulo', error });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const { id, chapterId } = req.params; // id: ID de la novela, chapterId: ID del capítulo
    const username = req.session.user.username; // Asumiendo que el username está en la sesión

    console.log(`Intentando eliminar capítulo: ${chapterId} de la novela: ${id} por el usuario: ${username}`);

    // Validar que ambos IDs estén presentes
    if (!id || !chapterId) {
      console.log('ID de la novela o del capítulo faltante.');
      return res.status(400).json({ message: 'ID de la novela y del capítulo son obligatorios.' });
    }

    // Buscar la novela por ID
    const novel = await Novel.findById(id);
    if (!novel) {
      console.log('Novela no encontrada.');
      return res.status(404).json({ message: 'Novela no encontrada.' });
    }

    // Verificar que el usuario sea el autor de la novela
    if (novel.author !== username) {
      console.log('Usuario no autorizado para eliminar capítulos de esta novela.');
      return res.status(403).json({ message: 'No tienes permiso para eliminar capítulos de esta novela.' });
    }

    // Verificar que el capítulo existe
    const chapter = novel.chapters.id(chapterId);
    if (!chapter) {
      console.log('Capítulo no encontrado.');
      return res.status(404).json({ message: 'Capítulo no encontrado.' });
    }

    // Eliminar el capítulo usando `pull`
    novel.chapters.pull(chapterId);
    console.log(`Capítulo ${chapterId} eliminado usando pull.`);

    // Guardar los cambios en la base de datos
    await novel.save();
    console.log('Cambios guardados en la base de datos.');

    // Responder al cliente
    res.status(200).json({ message: 'Capítulo eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar el capítulo:', error);
    res.status(500).json({ message: 'Error interno al eliminar el capítulo.', error: error.message });
  }
};



const addReview = async (req, res) => {
  const { id } = req.params; // ID de la novela
  const { comment } = req.body; // Datos de la reseña
  const userId = req.session?.user?.id; // ID del usuario autenticado

  if (!userId) {
    return res.status(401).json({ message: 'No autorizado. Por favor, inicia sesión.' });
  }


  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'El comentario no puede estar vacío.' });
  }

  try {
    const novel = await Novel.findById(id);
    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada.' });
    }

    // Agregar la reseña
    const newReview = {
      user: userId,
      comment,
    };

    novel.reviews.push(newReview);
    await novel.save();

    res.status(201).json({ message: 'Reseña agregada con éxito.', review: newReview });
  } catch (error) {
    console.error('Error al agregar la reseña:', error.message);
    res.status(500).json({ message: 'Error al agregar la reseña.', error });
  }
};

const searchNovels = async (req, res) => {
  const { query } = req.query;
  console.log('Término de búsqueda recibido:', query); // Log para depuración

  if (!query || query.trim() === '') {
    console.log('Término de búsqueda vacío.');
    return res.status(400).json({ message: 'El término de búsqueda no puede estar vacío.' });
  }

  try {
    const novels = await Novel.find({
      title: { $regex: query, $options: 'i' },
    });
    console.log('Resultados encontrados:', novels);
    res.status(200).json(novels);
  } catch (error) {
    console.error('Error al buscar novelas:', error.message);
    res.status(500).json({ message: 'Error al buscar novelas.', error });
  }
};

const getChapterById = async (req, res) => {
  const { storyId, chapterId } = req.params;

  try {
    const novel = await Novel.findById(storyId);
    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada.' });
    }

    // Encuentra el índice del capítulo en el array chapters
    const chapterIndex = novel.chapters.findIndex(ch => ch._id.toString() === chapterId);

    if (chapterIndex === -1) {
      return res.status(404).json({ message: 'Capítulo no encontrado.' });
    }

    // Obtiene el capítulo actual
    const currentChapter = novel.chapters[chapterIndex];

    // Determina previous y next
    const previous = chapterIndex > 0 ? novel.chapters[chapterIndex - 1]._id : null;
    const next = chapterIndex < novel.chapters.length - 1 ? novel.chapters[chapterIndex + 1]._id : null;

    // Convierte el capítulo a objeto (si es un subdocumento de Mongoose)
    const chapterObject = currentChapter.toObject ? currentChapter.toObject() : currentChapter;

    // Añade previous y next al objeto antes de enviarlo
    res.status(200).json({
      ...chapterObject,
      previous,
      next,
    });
  } catch (error) {
    console.error('Error al obtener el capítulo:', error.message);
    res.status(500).json({ message: 'Error al obtener el capítulo.', error: error.message });
  }
};


const deleteNovel = async (req, res) => {
  const { id } = req.params;
  const userId = req.session?.user?.id; // Asumiendo que estás almacenando el ID del usuario en la sesión

  // Validar que el ID proporcionado es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de novela no válido.' });
  }

  try {
    // Buscar la novela por ID
    const novel = await Novel.findById(id);
    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada.' });
    }

    // Verificar que el usuario que realiza la solicitud es el autor de la novela
    if (novel.author !== req.session.user.username) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta novela.' });
    }

    // Eliminar la novela
    await Novel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Novela eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la novela:', error.message);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const verifyPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  // Validar entrada
  if (!password) {
    return res.status(400).json({ message: 'La contraseña es requerida.' });
  }

  try {
    const novel = await Novel.findById(id);
    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada.' });
    }

    // Solo verificar si el idioma de origen es Coreano
    if (novel.languageOrigin !== 'Coreano') {
      return res.status(400).json({ message: 'Esta novela no requiere una contraseña.' });
    }

    // Verificar la contraseña utilizando bcrypt
    const isMatch = await bcrypt.compare(password, novel.password);
    if (isMatch) {

      return res.status(200).json({ message: 'Contraseña correcta.', authorized: true });
    } else {
      return res.status(401).json({ message: 'Contraseña incorrecta.', authorized: false });
    }
  } catch (error) {
    console.error('Error al verificar la contraseña:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
};



module.exports = {
  createNovel, getNovels, getLatestNovels,
  getNovelById, addChapter, addReview, searchNovels, getChapterById,
  deleteNovel, verifyPassword, deleteChapter
};