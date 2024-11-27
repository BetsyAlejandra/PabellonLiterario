const express = require('express');
const { createNovel, getNovels, getLatestNovels, getNovelById } = require('../controllers/novelController'); // Agregar controlador para obtener novelas
const upload = require('../middlewares/upload');
const Novel = require('../models/Novel');

const router = express.Router();

// Ruta para obtener todas las novelas
router.get('/', getNovels);

// Ruta para obtener una novela por ID
router.get('/:id', getNovelById);

//Ruta para obtener las últimas novelas agregadas
router.get('/latest', getLatestNovels);

// Ruta para crear una novela
router.post('/create', upload.single('coverImage'), createNovel);

// Ruta para obtener una novela por su ID
router.get('/:id', async (req, res) => {
    try {
      const novel = await Novel.findById(req.params.id); // Busca la novela por su ID
      if (!novel) {
        return res.status(404).json({ message: 'Novela no encontrada' }); // Si no se encuentra, responde con un 404
      }
      res.json(novel); // Si se encuentra, responde con la novela
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor' }); // Si hay un error, responde con un 500
    }
  });

module.exports = router;