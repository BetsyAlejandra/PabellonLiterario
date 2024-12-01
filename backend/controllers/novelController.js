const mongoose = require('mongoose');
const Novel = require('../models/Novel');

// Crear una novela
const createNovel = async (req, res) => {
  try {
    const { title, description, genres, classification, tags } = req.body;

    // Verificar si el archivo de imagen se subió
    if (!req.file) {
      return res.status(400).json({ message: 'La portada es obligatoria' });
    }

    // Guardar la URL de la imagen
    const coverImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const newNovel = await Novel.create({
      title,
      description,
      genres,
      classification,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [], // Convierte la lista de etiquetas en un array
      coverImage,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false, // Cambia a false mientras pruebas
      },
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
  console.log('Petición recibida en /latest');
  try {
    const novels = await Novel.find().sort({ createdAt: -1 }).limit(5); // Obtén las 5 más recientes
    console.log('Últimas novelas encontradas:', novels); // Log para depurar
    res.status(200).json(novels);
  } catch (error) {
    console.error('Error al obtener las últimas novelas:', error.message);
    res.status(500).json({ message: 'Error al obtener las últimas novelas', error });
  }
};

// Obtener una novela por ID
const getNovelById = async (req, res) => {
  const { id } = req.params;
  console.log(`Petición para obtener novela con ID: ${id}`); // Log para depurar

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


module.exports = { createNovel, getNovels, getLatestNovels, getNovelById, addChapter };