const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema(
  {
    // Información básica de la novela
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    genres: {
      type: [String],
      required: true,
    },
    subGenres: {
      type: [String],
      validate: {
        validator: function (subGenres) {
          return subGenres.length <= 15;
        },
        message: 'Puedes seleccionar hasta 15 subgéneros.',
      },
    },
    classification: {
      type: String,
      enum: ['+18', 'General'],
      required: true,
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags) {
          return Array.isArray(tags) && new Set(tags).size === tags.length;
        },
        message: 'Las etiquetas deben ser únicas',
      },
    },

    // Fechas y estado de la novela
    publishedAt: { type: Date },  // Fecha de publicación
    completedAt: Date,  // Fecha de finalización si aplica
    progress: {
      type: String,
      enum: ['En progreso', 'Finalizada', 'Pausada'],
      default: 'En progreso',
    },

    author: {
      type: String,
      required: [true, 'El autor es obligatorio'],
    },       
    collaborators: [
      {
        name: String,
        role: String, // Roles libres
      },
    ],

    // Imagen de la portada
    coverImage: {
      type: String,
      required: true,
    },

    // Información sobre el idioma
    language: {
      type: String,
      default: 'Español',
    },

    languageOrigin: {
      type: String,
      enum: ['Japonés', 'Chino', 'Coreano', 'Inglés'],
      required: true,
    },

    // Contadores y métricas de la novela
    views: { type: Number, default: 0 },  // Contador de vistas
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Usuarios que siguen la novela
    isPremium: { type: Boolean, default: false },  // Si es contenido premium

    password: { type: String, default: '' }, // Que tenga contraseña

    rawOrigin: [
      {
        origin: { type: String, required: true },
        link: String,
      },
    ],

    adaptations: [
      {
        type: { type: String }, // Roles libres
        title: String,
        link: String,
      },
    ],

    // Capítulos de la novela
    chapters: [{
      title: String,
      content: String,
      publishedAt: Date,
    }],

    // Reseñas de los usuarios
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: String,
      createdAt: { type: Date, default: Date.now },
      replies: [{
        text: String,
        createdAt: { type: Date, default: Date.now }
      }]
    }],

    // Premios que ha recibido la novela
    awards: [{
      title: String,
      year: Number,
      organization: String,
    }],

    // Comentarios adicionales de los usuarios
    comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now },
    }],

    // Recomendaciones relacionadas
    recommendedNovels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Novel' }],
  },
  { timestamps: true }  // Para registrar las fechas de creación y actualización
);

module.exports = mongoose.model('Novel', novelSchema);