const express = require('express');
const { createNovel, getNovels, getLatestNovels, getNovelById, addChapter } = require('../controllers/novelController');
const { upload, handleMulterError } = require('../middlewares/upload');

const router = express.Router();

// Rutas específicas primero
router.get('/latest', getLatestNovels);
router.get('/', getNovels);
// Ruta para subir una novela con imagen
router.post('/create', upload, handleMulterError, createNovel);
router.get('/:id', getNovelById);
router.post('/add-chapter/:id', addChapter);

module.exports = router;
