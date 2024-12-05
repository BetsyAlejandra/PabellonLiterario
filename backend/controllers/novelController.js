const mongoose = require('mongoose');
const Novel = require('../models/Novel');
const User = require('../models/User');

// Crear una novela
const createNovel = async (req, res) => {
  try {

    if (!req.session.user || !req.session.user.username) {
      return res.status(401).json({ message: 'No autorizado. Debe iniciar sesión para crear una novela.' });
    }

    const authorUsername = req.session.user.username;

    const { title, description, genres, classification, tags } = req.body;

    const validGenres = [
      'Fantasía', 'Horror', 'Moderno', 'Policial', 'Transmigración',
      'Transmigración Rápida', 'Viaje en el Tiempo', 'Xianxia', 'Recuentos de Vida',
      'Renacimiento', 'Antiguo', 'Contemporaneo', 'ABO', 'Juvenil', 'Interestelar',
      'Romance', 'Ciencia ficción', 'Drama', 'Aventura', 'Terror', 'Misterio',
      'Suspenso', 'Comedia', 'Histórico', 'Poesía', 'Distopía',
    ];

    // Asegúrate de que genres sea un arreglo
    const parsedGenres = typeof genres === 'string' ? JSON.parse(genres) : genres;

    // Validar que parsedGenres sea un arreglo antes de verificar los géneros
    if (!Array.isArray(parsedGenres) || !parsedGenres.every((genre) => validGenres.includes(genre))) {
      return res.status(400).json({ message: 'Género(s) inválido(s) o datos no válidos.' });
    }
    console.log('genres recibido en el backend:', parsedGenres);


    // Verificar si el archivo de imagen se subió
    if (!req.file) {
      return res.status(400).json({ message: 'La portada es obligatoria' });
    }
    // Verificar si el usuario existe
    const user = await User.findOne({ username: authorUsername });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Guardar la URL de la imagen
    const coverImage = `/uploads/${req.file.filename}`;

    const newNovel = await Novel.create({
      title,
      description,
      genres: parsedGenres,
      classification,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      coverImage,
      author: authorUsername, // Almacena el username en lugar del ObjectId
    });

    res.status(201).json(newNovel);
  } catch (error) {
    console.error('Error al crear la novela:', error.message);
    res.status(500).json({ message: 'Error al crear la novela', error });
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
    const { title, content } = req.body;  // Título y contenido del capítulo

    // Validar los datos
    if (!title || !content) {
      return res.status(400).json({ message: 'El título y contenido del capítulo son obligatorios' });
    }

    // Crear el nuevo capítulo
    const newChapter = {
      title,
      content,
      publishedAt: new Date(),  // Fecha de publicación del capítulo (actual)
    };

    // Buscar la novela por su ID y agregar el capítulo
    const novel = await Novel.findById(id);
    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada' });
    }

    // Agregar el capítulo al array de capítulos
    novel.chapters.push(newChapter);

    // Guardar los cambios en la novela
    await novel.save();

    res.status(201).json({ message: 'Capítulo agregado con éxito', chapter: newChapter });
  } catch (error) {
    console.error('Error al agregar el capítulo:', error.message);
    res.status(500).json({ message: 'Error al agregar el capítulo', error });
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

    const chapter = novel.chapters.id(chapterId); // Buscar capítulo por su ID en el array
    if (!chapter) {
      return res.status(404).json({ message: 'Capítulo no encontrado.' });
    }

    res.status(200).json(chapter); // Enviar el capítulo como respuesta
  } catch (error) {
    console.error('Error al obtener el capítulo:', error.message);
    res.status(500).json({ message: 'Error al obtener el capítulo.', error: error.message });
  }
};


module.exports = {
  createNovel, getNovels, getLatestNovels,
  getNovelById, addChapter, addReview, searchNovels, getChapterById
};