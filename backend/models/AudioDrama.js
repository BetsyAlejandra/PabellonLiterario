const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  episode: { type: Number, required: true },
  title: { type: String, required: true }, 
  description: { type: String }, 
  videoLinks: [
    {
      platform: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  likes: { type: Number, default: 0 },
  publishedAt: { type: Date }, 
});

const SeasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number, required: true },
  chapters: [ChapterSchema],
});

const AudioDramaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  genres: { type: [String], required: true },
  progress: {
    type: String,
    enum: ['En progreso', 'Finalizado', 'Pausado'],
    default: 'En progreso',
  },
  seasons: [SeasonSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AudioDrama', AudioDramaSchema);