const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db');
const fs = require('fs');

// Rutas
const novelRoutes = require('./routes/novels');
const userRoutes = require('./routes/users');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS en producción
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Política de cookies
    maxAge: 3600 * 1000, // Sesión de 1 hora
  },
}));

// Crear carpeta 'uploads' si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
=======
app.get('/', (req, res) => {
  res.status(200).send('Backend funcionando correctamente');
});


// Rutas
app.use('/api/users', userRoutes);
app.use('/api/novels', novelRoutes);


// Servir en producción
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
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

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));