// routes/donations.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// Endpoint para recibir webhooks de Ko-fi
router.post('/webhook', async (req, res) => {
  const data = req.body.data ? JSON.parse(req.body.data) : null;

  if (!data) {
    return res.status(400).send('No data received');
  }

  // Verificar el token de verificación
  if (data.verification_token !== process.env.KOFI_VERIFICATION_TOKEN) {
    return res.status(401).send('Invalid verification token');
  }

  // Verificar si la donación es pública
  if (!data.is_public) {
    return res.status(200).send('Donation not public, ignoring');
  }

  // Crear una nueva donación
  const donation = new Donation({
    fromName: data.from_name,
    message: data.message,
    amount: parseFloat(data.amount),
    timestamp: new Date(data.timestamp),
  });

  try {
    await donation.save();
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error al guardar la donación:', error);
    res.status(500).send('Server error');
  }
});

// Endpoint para obtener las donaciones top
router.get('/top', async (req, res) => {
  try {
    const topDonors = await Donation.aggregate([
      {
        $group: {
          _id: '$fromName',
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    const formattedTopDonors = topDonors.map(donor => ({
      name: donor._id,
      total: donor.total,
    }));

    res.json(formattedTopDonors);
  } catch (error) {
    console.error('Error al obtener los donadores top:', error);
    res.status(500).send('Server error');
  }
});

// Endpoint para obtener las donaciones recientes
router.get('/recent', async (req, res) => {
  try {
    const recentDonations = await Donation.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .exec();

    res.json(recentDonations);
  } catch (error) {
    console.error('Error al obtener las donaciones recientes:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;