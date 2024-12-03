const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Por favor, ingresa un correo válido'],
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: ['Lector', 'Editor', 'Traductor', 'Escritor', 'Admin'],
      default: ['Lector'],
    },
    profilePhoto: { type: String, default: '/uploads/perfil.jpg' },
    coverPhoto: { type: String, default: 'https://defaultimage.com/cover.jpg' },
    description: { type: String, default: '' },
    socialLinks: {
      type: [String], // Arreglo de URLs para redes sociales
      default: [], // Por defecto, un arreglo vacío
      validate: {
        validator: function (links) {
          return links.every((link) =>
            /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)\.([a-z]{2,})(\/.*)?$/i.test(link)
          );
        },
        message: 'Algunos enlaces no tienen un formato válido.',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Registra creación y actualización
);

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);