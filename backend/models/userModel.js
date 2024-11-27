const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: [true, 'Nombre de usuario obligatorio'],
            unique: true,
            trim: true,
        },
        email:{
            type: String,
            required: [true, 'Correo electrónico obligatorio'],
            unique: true,
            trim:true,
        },
        password: {
            type: String,
            required: [true, 'Contraseña obligatoria'],
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('User', userSchema);
