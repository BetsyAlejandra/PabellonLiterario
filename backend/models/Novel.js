const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [150, 'El título no debe exceder los 150 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'La sinopsis es obligatoria'],
      maxlength: [2000, 'La sinopsis no debe exceder los 2000 caracteres'],
    },
    genres: {
      type: [String],
      required: [true, 'Debe seleccionar al menos un género'],
      enum: [
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
        'Biografía',
        'Autobiografía',
        'Ensayo',
        'Crónica',
        'Épico',
        'Ficción especulativa',
        'Mitología',
      ],
    },
    classification: {
      type: String,
      enum: ['+18', 'General'],
      required: [true, 'La clasificación es obligatoria'],
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags) {
          // Validar que las etiquetas sean únicas
          return Array.isArray(tags) && new Set(tags).size === tags.length;
        },
        message: 'Las etiquetas deben ser únicas',
      },
    },
    coverImage: {
      type: String,
      required: [true, 'La portada es obligatoria'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencia al modelo de usuario (asume que existe)
      required: [true, 'El autor es obligatorio'],
    },
    status: {
      type: String,
      enum: ['En progreso', 'Completo', 'Pausado'],
      default: 'En progreso',
    },
    language: {
      type: String,
      default: 'Español',
    },
    chapterCount: {
      type: Number,
      default: 0, // Se puede actualizar conforme se agregan capítulos
      min: [0, 'El número de capítulos no puede ser negativo'],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'La calificación promedio no puede ser negativa'],
      max: [5, 'La calificación promedio no puede exceder 5'],
    },
    ratingsCount: {
      type: Number,
      default: 0, // Número de calificaciones recibidas
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    readCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Preprocesar etiquetas para eliminar espacios adicionales
novelSchema.pre('save', function (next) {
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map((tag) => tag.trim().toLowerCase());
  }
  next();
});

module.exports = mongoose.model('Novel', novelSchema);
