const mongoose = require('mongoose');

const ActualizacionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Actualizacion', ActualizacionSchema);
