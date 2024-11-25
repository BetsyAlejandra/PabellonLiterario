const express = require('express');
const { createNovel } = require('../controllers/novelController');
const upload = require('../middlewares/upload');

const router = express.Router();

// Ruta para crear una novela con portada
router.post('/create', upload.single('coverImage'), createNovel);

module.exports = router;
