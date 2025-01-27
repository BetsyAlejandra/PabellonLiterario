const AudioDrama = require('../models/AudioDrama');

// Crear un audio drama
const createAudioDrama = async (req, res) => {
  try {
    const newAudioDrama = new AudioDrama(req.body);
    const savedDrama = await newAudioDrama.save();
    res.status(201).json(savedDrama);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener episodios por temporada
const getEpisodesBySeason = async (req, res) => {
  try {
    const { season } = req.params;
    const episodes = await AudioDrama.find({ season }).sort({ episode: 1 });
    res.json(episodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Incrementar likes
const likeAudioDrama = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDrama = await AudioDrama.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(updatedDrama);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAudioDrama,
  getEpisodesBySeason,
  likeAudioDrama,
};