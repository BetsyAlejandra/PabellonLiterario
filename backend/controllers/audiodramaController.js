const AudioDrama = require('../models/AudioDrama');

// Crear un nuevo audio drama
exports.createAudioDrama = async (req, res) => {
  try {
    const audioDrama = new AudioDrama(req.body);
    const savedDrama = await audioDrama.save();
    res.status(201).json(savedDrama);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el audio drama', error });
  }
};

// Agregar una nueva temporada
exports.addSeason = async (req, res) => {
  try {
    const { id } = req.params; // ID del audio drama
    const { seasonNumber, chapters } = req.body;

    const audioDrama = await AudioDrama.findById(id);
    if (!audioDrama) return res.status(404).json({ message: 'Audio drama no encontrado' });

    audioDrama.seasons.push({ seasonNumber, chapters });
    await audioDrama.save();
    res.status(200).json(audioDrama);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar temporada', error });
  }
};

// Agregar capítulo a una temporada
exports.addChapter = async (req, res) => {
  try {
    const { id, seasonNumber } = req.params;
    const chapter = req.body;

    const audioDrama = await AudioDrama.findById(id);
    if (!audioDrama) return res.status(404).json({ message: 'Audio drama no encontrado' });

    const season = audioDrama.seasons.find(s => s.seasonNumber === parseInt(seasonNumber));
    if (!season) return res.status(404).json({ message: 'Temporada no encontrada' });

    season.chapters.push(chapter);
    await audioDrama.save();
    res.status(200).json(audioDrama);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar capítulo', error });
  }
};

// Obtener detalles de un audio drama con temporadas y capítulos
exports.getAudioDramaDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const audioDrama = await AudioDrama.findById(id);
    if (!audioDrama) return res.status(404).json({ message: 'Audio drama no encontrado' });

    res.status(200).json(audioDrama);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el audio drama', error });
  }
};