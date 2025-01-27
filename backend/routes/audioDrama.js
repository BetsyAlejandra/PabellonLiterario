const express = require('express');
const router = express.Router();
const audioDramaController = require('../controllers/audiodramaController');
const AudioDrama = require('../models/AudioDrama');

// Rutas de audio dramas
router.post('/', audioDramaController.createAudioDrama);
// Obtener todos los audiodramas
router.get('/', async (req, res) => {
    try {
      const audioDramas = await AudioDrama.find();
      res.json(audioDramas);
    } catch (error) {
      res.status(500).json({ error: 'Error al cargar los audiodramas' });
    }
  });
router.post('/:id/seasons', audioDramaController.addSeason);
router.post('/:id/seasons/:seasonNumber/chapters', audioDramaController.addChapter);
router.get('/:id', audioDramaController.getAudioDramaDetails);

module.exports = router;