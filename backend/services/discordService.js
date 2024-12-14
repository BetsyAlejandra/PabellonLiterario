const axios = require('axios');

// Obtener la URL del webhook desde las variables de entorno
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

/**
 * Envía una notificación a Discord mediante el webhook usando un embed.
 * @param {Object} update - Objeto que contiene detalles de la actualización.
 * @param {string} update.titulo - Título de la actualización.
 * @param {string} update.descripcion - Descripción de la actualización.
 * @param {string} update.link - Enlace a la actualización.
 */
const sendDiscordNotification = async (update) => {
  if (!DISCORD_WEBHOOK_URL) {
    console.error('DISCORD_WEBHOOK_URL no está configurada.');
    return;
  }

  const embed = {
    title: '¡Actualización en Pabellón Literario! 📚✨',
    url: update.link,
    description: `**Capítulo:** ${update.titulo}\n\n**De:**\n${update.descripcion}`,
    color: 0xffd700, 
    timestamp: new Date(),
    author: {
      name: 'Pabellón Literario',
    },
    image: {
      url: `https://pabellonliterario.com/uploads/actualizacion.png`, // Imagen destacada
    },
    footer: {
      text: 'Visita Pabellón Literario para más actualizaciones',
    },
    fields: [
      {
        name: '📖 Detalles',
        value: `¡Descubre más sobre esta actualización [aquí](${update.link})!`,
      },
    ],
  };

  const payload = {
    username: '📖Actualizacion Pabellón Literario',
    embeds: [embed],
  };

  try {
    await axios.post(DISCORD_WEBHOOK_URL, payload);
    console.log('Notificación con embed enviada a Discord.');
  } catch (error) {
    console.error('Error al enviar notificación a Discord:', error.message);
  }
};

module.exports = {
  sendDiscordNotification,
};
