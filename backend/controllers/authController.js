import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt, { createAccessToken } from "../libs/jwt.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({id: userSaved.id})
    res.cookie("token", token);
    res.json({
      id: userSaved.id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

module.exports = { registerUser };

//login

const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = await createAccessToken({id: userFound.password});

    res.cookies("token", token);
    res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

module.exports = { loginUser };

export const logOut = async(req, res) => {
  res.cookie('token', "", {
    expires: new Date(0),
  });

  return res.sendStatus(200);


};

export const profile = async(req,res) =>{
  const userFound = await User.findById(req.User.id)
  res.send('profile')

  if(!userFound) return res.status(400).json({message: "Usuario no encontrado"});

  return res.json({
    id: userFound.id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  })
}
