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
      type: [String],
      required: [true, 'Debe seleccionar al menos un género'],
    },
    classification: {
      type: String,
      enum: ['+18', 'General'],
      required: [true, 'La clasificación es obligatoria'],
    },
    coverImage: {
      type: String, // URL de la imagen
      required: [true, 'La portada es obligatoria'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Novel', novelSchema);
