const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const connectDB = require('./config/db');
const novelRoutes = require('./routes/novels');

// Cargar configuración del archivo .env
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Crear la carpeta 'uploads' si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middlewares
app.use(express.json()); // Parsear JSON en las solicitudes
const allowedOrigins = [
  'http://localhost:3000', // Para desarrollo
  'https://pabellonliterario.com', // Para producción
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No autorizado por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.status(200).send('Backend funcionando correctamente');
});

// Configurar carpeta estática para las imágenes subidas
app.use('/uploads', express.static(uploadsDir));

// Rutas de novelas
app.use('/api/novels', novelRoutes);

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendPath));

  // Servir la aplicación React para todas las rutas no manejadas
  app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Array para almacenar los donantes
let donors = [];

// Webhook de Ko-fi para recibir donaciones
app.post('/api/webhook/kofi', (req, res) => {
  const { event, data } = req.body;
  console.log('Cuerpo del webhook recibido:', req.body);

  if (event === 'payment_received' && data) {
    const { name, amount, message } = data;

    if (name && amount) {
      const donor = { name, amount, message: message || '' };
      donors.push(donor); // Almacena la información del donante
      console.log('Nueva donación recibida:', donor);
    } else {
      console.warn('Datos incompletos en el webhook de Ko-fi');
    }
  } else {
    console.warn('Evento desconocido o datos inválidos recibidos en el webhook');
  }

  res.status(200).send('Webhook recibido');
});

// Ruta para obtener la lista de donantes
app.get('/api/donors', (req, res) => {
  res.status(200).json(donors); // Devuelve los donantes almacenados
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ message: 'Servidor funcionando correctamente' });
});

// Puerto de escucha del servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
