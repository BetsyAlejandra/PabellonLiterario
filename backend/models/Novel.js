const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La sinopsis es obligatoria'],
    },
    genres: {
      type: [String], // Cambiado a un array de cadenas
      required: [true, 'Debe seleccionar al menos un género'],
      enum: ['Fantasia', 'Romance', 'Ciencia ficción', 'Drama', 'Aventura', 'Terror'], // Opciones predefinidas
    },
    classification: {
      type: String,
      enum: ['+18', 'General'],
      required: [true, 'La clasificación es obligatoria'],
    },
    tags: {
      type: [String], // Lista de etiquetas
      required: false,
    },
    coverImage: {
      type: String, // URL de la imagen
      required: [true, 'La portada es obligatoria'],
    },
    commentsCount: {
      type: Number,
      default: 0, // Valor inicial de cero
    },
    readCount: {
      type: Number,
      default: 0, // Valor inicial de cero
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Novel', novelSchema);
