const express = require('express');
const {
    createAudioDrama,
    getEpisodesBySeason,
    likeAudioDrama,
  } = require('../controllers/audiodramaController.js');

const router = express.Router();

// Crear un nuevo audio drama
router.post('/', createAudioDrama);

// Obtener episodios por temporada
router.get('/season/:season', getEpisodesBySeason);

// Incrementar likes de un episodio
router.patch('/:id/like', likeAudioDrama);

module.exports = router;