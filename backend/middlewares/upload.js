const multer = require('multer');
const path = require('path');

// Crear carpeta 'uploads' si no existe
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    // Crear un nombre único para el archivo
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  },
});

// Filtrar archivos permitidos
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png).'));
  }
};

// Configuración del middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Límite de tamaño: 5MB
}).single('coverImage'); // Nombre del campo del archivo esperado

// Middleware de manejo de errores para multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Error de Multer:', err.message); // Imprimir mensaje del error
    return res.status(400).json({ message: `Error al subir el archivo: ${err.message}` });
  } else if (err) {
    // Otros errores (ej., tipo de archivo no permitido)
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = { upload, handleMulterError };