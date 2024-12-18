const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const fs = require('fs');

// Rutas
const novelRoutes = require('./routes/novels');
const userRoutes = require('./routes/users');
const actualizacionRoutes = require('./routes/actualizaciones');
const donationRoutes = require('./routes/donations');

// Configuración de Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 solicitudes por ventana
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true, // Retorna información de límite en los headers
  legacyHeaders: false, // Desactiva los headers X-RateLimit
});

dotenv.config();
connectDB();

const app = express();

// Configura 'trust proxy'
app.set('trust proxy', 1); // Si estás usando un solo proxy, como Nginx

// Middleware de seguridad
app.use(helmet());


// Configuración de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// Middleware para parsear JSON y cookies
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));

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
  },
}));

// Crear carpeta 'uploads' si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas API
app.use('/api/users', userRoutes);
app.use('/api/novels', novelRoutes);
app.use('/api/donations', donationRoutes);

// Servir en producción
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
}

// Endpoint de prueba
app.get('/api/status', (req, res) => {
  res.status(200).json({ message: 'Servidor funcionando correctamente' });
});

// Middleware para manejo de errores (debe estar después de las rutas)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));