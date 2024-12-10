// routes/actualizaciones.js

const express = require('express');
const router = express.Router();
const { sendDiscordNotification } = require('../services/discordService');
const Actualizacion = require('../models/Actualizacion'); // Modelo de Mongoose o similar

// Ruta para crear una nueva actualización
router.post('/', async (req, res) => {
  const { titulo, descripcion, link } = req.body;

  if (!titulo || !descripcion || !link) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Crear y guardar la actualización en la base de datos
    const nuevaActualizacion = new Actualizacion({ titulo, descripcion, link });
    await nuevaActualizacion.save();

    // Preparar los detalles de la actualización para Discord
    const updateDetails = {
      titulo: nuevaActualizacion.titulo,
      descripcion: nuevaActualizacion.descripcion,
      link: nuevaActualizacion.link,
    };

    // Enviar la notificación a Discord
    sendDiscordNotification(updateDetails);

    // Responder al cliente
    res.status(201).json(nuevaActualizacion);
  } catch (error) {
    console.error('Error al crear la actualización:', error.message);
    res.status(500).json({ error: 'Error al crear la actualización.' });
  }
});

module.exports = router;