const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  fromName: { type: String, required: true },
  message: { type: String, default: null },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;