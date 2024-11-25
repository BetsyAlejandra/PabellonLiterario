const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const novelRoutes = require('./routes/novelRoutes');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/novels', novelRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
