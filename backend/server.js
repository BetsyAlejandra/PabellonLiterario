const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const novelRoutes = require('./routes/novels');

const fs = require('fs');

// Asegúrate de que la carpeta 'uploads' exista
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Mover esto arriba, antes de las rutas
app.use(cors({
  origin: 'http://localhost:3000', // Frontend
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(bodyParser.json()); // Si el webhook envía JSON

app.use('/api/novels', novelRoutes);

// Array para almacenar los donantes
let donors = [];

// Ruta que recibirá los datos del webhook
app.post('/api/webhook/kofi', (req, res) => {
  const { event, data } = req.body;

  if (event === 'payment_received') {
    // Suponiendo que Ko-fi envía información del donante como 'name' y 'amount'
    const { name, amount, message } = data;
    const donor = { name, amount, message };
    donors.push(donor); // Almacena el donante en la lista
  }

  res.status(200).send('Webhook recibido');
});

// Ruta para obtener los donantes
app.get('/api/donors', (req, res) => {
  res.json(donors); // Devuelve los donantes almacenados
});

// Configurar carpeta estática para las imágenes subidas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});