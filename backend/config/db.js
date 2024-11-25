const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Carga las variables de entorno desde .env
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB conectado: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error de conexión: ${error.message}`.red.bold);
    process.exit(1); // Finaliza la aplicación si no se puede conectar
  }
};

module.exports = connectDB;
