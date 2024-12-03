const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registro de usuarios
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        console.log('Faltan campos requeridos');
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Usuario ya existe');
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const newUser = new User({ username, email, password, roles: ['Lector'] });
        await newUser.save();
        console.log('Usuario creado:', newUser);

        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            roles: newUser.roles,
        };

        res.status(201).json({ message: 'Usuario registrado exitosamente', user: req.session.user });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};


// Inicio de sesión
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    try {
      const user = await User.findOne({ email: email.trim() });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
      if (!isPasswordValid) {
        return res.status(403).json({ message: 'Contraseña incorrecta' });
      }
  
      req.session.user = {
        id: user._id,
        username: user.username,
        roles: user.roles,
        profilePhoto: `${req.protocol}://${req.get('host')}${user.profilePhoto}`,
      };
  
      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user._id,
          username: user.username,
          profilePhoto: user.profilePhoto,
          roles: user.roles,
        },
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
  };
  

// Cierre de sesión
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión', error: err });
        }

        res.clearCookie('connect.sid'); // Borra la cookie de la sesión
        res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    });
};
