const Novel = require('../models/Novel');
const path = require('path');

// Crear una novela
const createNovel = async (req, res) => {
  try {
    const { title, description, genres, classification } = req.body;

    // Verificar si el archivo de imagen se subió
    if (!req.file) {
      return res.status(400).json({ message: 'La portada es obligatoria' });
    }

    // Guardar la URL de la imagen
    const coverImage = `/uploads/${req.file.filename}`;

    const newNovel = await Novel.create({
      title,
      description,
      genres: genres.split(','), // Si envías los géneros como una cadena separada por comas
      classification,
      coverImage,
    });

    res.status(201).json(newNovel);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la novela', error });
  }
};

module.exports = { createNovel };
