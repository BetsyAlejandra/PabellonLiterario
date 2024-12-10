const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Novel = require('../models/Novel'); // Ajusta la ruta según la estructura de tu proyecto
const router = express.Router();
const userController = require('../controllers/userController');


const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  console.error('No autorizado: la sesión no existe o ha expirado');
  return res.status(401).json({ message: 'No autorizado. Por favor, inicia sesión.' });
};
// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`); // Nombre único
  },
});
// Filtrar archivos por tipo
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};
// Inicializar multer con configuración
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limitar tamaño del archivo a 5MB
});
module.exports = upload;

const ADMIN_ID = '674ceb9febf82a8ddeecbbea'; // ID del usuario administrador

// Middleware para verificar si el usuario es Admin
function isAdmin(req, res, next) {
  if (
    req.session.user && 
    (req.session.user.roles.includes('Admin') || req.session.user.id === ADMIN_ID)
  ) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: Solo para administradores' });
  }
}

// Ruta para obtener todos los usuarios
router.get('/all', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('username roles email profilePhoto'); // Recupera solo campos necesarios
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
});

router.get('/translators', async (req, res) => {
  try {
    // Filtra usuarios que tienen 'Traductor' en el array de roles
    const translators = await User.find({ roles: 'Traductor' }).select('username roles email profilePhoto');
    res.status(200).json(translators);
  } catch (error) {
    console.error('Error al obtener traductores:', error);
    res.status(500).json({ message: 'Error al obtener traductores', error });
  }
});

router.get('/editors', async (req, res) => {
  try {
    const editors = await User.find({ roles: 'Editor' }).select('username roles email profilePhoto');
    res.status(200).json(editors);
  } catch (error) {
    console.error('Error al obtener editores:', error);
    res.status(500).json({ message: 'Error al obtener editores', error });
  }
});


// Ruta para asignar el rol de Admin
router.put('/assign-admin', isAdmin, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'ID de usuario requerido' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.roles = ['Admin'];
    await user.save();

    res.status(200).json({ message: 'Usuario ahora es Admin', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar rol de Admin', error });
  }
});

// Ruta para asignar roles a un usuario
router.put('/assign-roles/:id', isAdmin, async (req, res) => {
  const { roles } = req.body;

  if (!Array.isArray(roles) || roles.some((role) => !['Lector', 'Editor', 'Traductor', 'Escritor', 'Admin'].includes(role))) {
    return res.status(400).json({ message: 'Roles inválidos' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.roles = roles;
    await user.save();

    res.status(200).json({ message: 'Roles asignados correctamente', roles: user.roles });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar roles', error });
  }
});

// Rutas de usuario
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Endpoint para obtener el perfil del usuario
router.get('/profile', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'No autorizado. Inicia sesión.' });
    }

    const user = await User.findById(req.session.user.id).select(
      'username profilePhoto coverPhoto description roles socialLinks'
    );

    console.log('Usuario cargado:', user);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      profilePhoto: `${req.protocol}://${req.get('host')}${user.profilePhoto}`,
      coverPhoto: user.coverPhoto || 'https://defaultimage.com/cover.jpg',
      roles: user.roles || [], // Devuelve roles como un array
      description: user.description || 'No hay descripción disponible',
      socialLinks: user.socialLinks || [],
    });
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
    res.status(500).json({ message: 'Error al cargar el perfil', error: error.message });
  }
});

router.put('/profile', isAuthenticated, upload.single('profilePhoto'), async (req, res) => {

  const { description, socialLinks } = req.body;

  try {
    const user = await User.findById(req.session.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualiza los campos permitidos
    if (req.file) {
      user.profilePhoto = `/uploads/${req.file.filename}`; // Guarda la URL de la nueva foto
    }
    if (description) user.description = description.trim();
    if (socialLinks) {
      const socialLinksArray = JSON.parse(socialLinks); // Convierte la cadena JSON a un arreglo

      if (!Array.isArray(socialLinksArray)) {
        return res.status(400).json({ message: 'Las redes sociales deben ser un arreglo de URLs.' });
      }

      const invalidLinks = socialLinksArray.filter(
        (link) => !/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)\.([a-z]{2,})(\/.*)?$/i.test(link)
      );

      if (invalidLinks.length > 0) {
        return res.status(400).json({
          message: `Algunos enlaces no son válidos: ${invalidLinks.join(', ')}`,
        });
      }

      user.socialLinks = socialLinksArray.map((link) => link.trim());
    }

    // Guarda los cambios
    await user.save();

    res.status(200).json({
      message: 'Perfil actualizado correctamente',
      user: {
        profilePhoto: `${req.protocol}://${req.get('host')}${user.profilePhoto}`,
        username: user.username,
        roles: user.roles,
        description: user.description,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil', error });
  }
});

// Ruta para obtener una sola sugerencia de usuario
router.get('/api/users/suggestions', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'El parámetro "name" es requerido.' });
  }

  try {
    const regex = new RegExp(name, 'i');
    const user = await User.findOne({ username: regex }).select('username _id');
    // Si no encuentras ningún usuario, puedes devolver null o un error
    if (!user) {
      return res.json(null);
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/profileperson/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('username profilePhoto description roles socialLinks');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const profilePhotoUrl = user.profilePhoto.startsWith('http') 
      ? user.profilePhoto
      : `${req.protocol}://${req.get('host')}${user.profilePhoto}`;

    let translatedWorks = [];
    if (user.roles.includes('Traductor')) {
      const novels = await Novel.find({ author: username }).select('title coverImage');
      translatedWorks = novels.map(novel => ({
        id: novel._id,
        title: novel.title,
        coverImage: novel.coverImage
      }));
    }

    res.status(200).json({
      username: user.username,
      profilePhoto: profilePhotoUrl,
      roles: user.roles || [],
      description: user.description || 'Sin descripción',
      socialLinks: user.socialLinks || [],
      translatedWorks
    });
  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;