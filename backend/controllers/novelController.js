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
    });

    res.status(201).json(newNovel);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la novela', error });
  }
};

// Obtener todas las novelas
const getNovels = async (req, res) => {
  try {
    const novels = await Novel.find().sort({ createdAt: -1 }); // Ordena por fecha de creación (más recientes primero)
    res.status(200).json(novels);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las novelas', error });
  }
};

const getLatestNovels = async (req, res) => {
  try {
    // Obtener las novelas más recientes, limitando el número
    const novels = await Novel.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(novels);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las novelas', error });
  }
};

const getNovelById = async (req, res) => {
  const { id } = req.params;
  // Verificar si el id es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const novel = await Novel.findById(id);
    if (!novel) {
      return res.status(404).json({ message: 'Novela no encontrada' });
    }
    res.status(200).json(novel);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la novela', error });
  }
};



module.exports = { createNovel, getNovels, getLatestNovels, getNovelById };
