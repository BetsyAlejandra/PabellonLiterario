const mongoose = require('mongoose');

const AudioDramaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  season: { type: Number, required: true },
  episode: { type: Number, required: true },
  videoLinks: [
    {
      platform: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AudioDrama', AudioDramaSchema);