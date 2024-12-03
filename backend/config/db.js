const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Carga las variables de entorno desde .env
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1); // Detiene el servidor si hay error
  }
};

module.exports = connectDB; 
